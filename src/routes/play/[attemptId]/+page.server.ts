import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getQuizAttempt, submitAttemptAnswer } from '$lib/server/quiz';

export const load: PageServerLoad = async ({ params, locals, platform, setHeaders, url }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	if (!locals.playerId) {
		throw error(403, 'This game does not belong to this player.');
	}

	if (!platform?.env?.DB) {
		throw error(
			500,
			'Database binding (DB) is unavailable. Run `npm run preview` to test with Cloudflare D1.'
		);
	}

	const db = getDb(platform.env.DB);
	let quizResult;
	try {
		quizResult = await getQuizAttempt(db, {
			attemptId: params.attemptId,
			playerId: locals.playerId
		});
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Game not found.';
		if (message.includes('Unauthorized')) {
			throw error(403, 'This game does not belong to this player.');
		}
		throw error(404, 'Game not found.');
	}

	if (quizResult.isFinished || quizResult.attempt.status === 'finished') {
		throw redirect(303, `/results/${quizResult.attempt.id}`);
	}

	if (quizResult.attempt.status === 'abandoned') {
		throw error(403, 'This game is no longer active.');
	}

	if (!quizResult.currentQuestion) {
		throw redirect(303, `/results/${quizResult.attempt.id}`);
	}

	return {
		attempt: quizResult.attempt,
		question: quizResult.currentQuestion,
		totalQuestions: quizResult.totalQuestions,
		answerResult: url.searchParams.get('result'),
		allQuestions: quizResult.allQuestions,
		answeredMap: quizResult.answeredMap
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals, platform }) => {
		if (!locals.playerId) {
			throw error(403, 'This game does not belong to this player.');
		}

		if (!platform?.env?.DB) {
			throw error(
				500,
				'Database binding (DB) is unavailable. Run `npm run preview` to test with Cloudflare D1.'
			);
		}

		const db = getDb(platform.env.DB);
		const formData = await request.formData();
		const submittedQuestionId = formData.get('questionId')?.toString();
		const isFinishAction = formData.get('finish') === 'true';

		let quizResult;
		try {
			quizResult = await getQuizAttempt(db, {
				attemptId: params.attemptId,
				playerId: locals.playerId
			});
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : 'Game not found.';
			if (message.includes('Unauthorized')) {
				throw error(403, 'This game does not belong to this player.');
			}
			throw error(404, 'Game not found.');
		}

		if (quizResult.isFinished || quizResult.attempt.status === 'finished') {
			throw redirect(303, `/results/${quizResult.attempt.id}`);
		}

		if (quizResult.attempt.status === 'abandoned') {
			throw error(403, 'This game is no longer active.');
		}

		const targetQuestion = submittedQuestionId
			? (quizResult.allQuestions.find((q) => q.id === submittedQuestionId) ??
				quizResult.currentQuestion)
			: quizResult.currentQuestion;

		if (!targetQuestion) {
			throw error(400, 'This question is no longer available to answer.');
		}

		let answer: string | string[] = '';

		if (targetQuestion.format === 'word_ordering') {
			const rawAnswer = formData.get('answer');
			if (typeof rawAnswer === 'string' && rawAnswer.length > 0) {
				try {
					const parsed = JSON.parse(rawAnswer);
					answer = Array.isArray(parsed) ? parsed : rawAnswer;
				} catch {
					answer = rawAnswer;
				}
			} else {
				const choices = targetQuestion.choices ?? [];
				const values: string[] = [];
				for (let i = 0; i < choices.length; i++) {
					const val = formData.get(`answer-${i}`);
					if (typeof val === 'string' && val.length > 0) {
						values.push(val);
					}
				}
				if (values.length > 0) {
					answer = values;
				}
			}
		} else {
			const rawAnswer = formData.get('answer');
			if (typeof rawAnswer === 'string' && rawAnswer.trim().length > 0) {
				answer = rawAnswer.trim();
			}
		}

		const rawDuration = formData.get('durationSeconds');
		const durationSeconds =
			typeof rawDuration === 'string' ? Math.max(0, parseInt(rawDuration, 10) || 0) : 0;

		const outcome = await submitAttemptAnswer(db, {
			attemptId: params.attemptId,
			playerId: locals.playerId,
			questionId: targetQuestion.id,
			answer,
			durationSeconds,
			finish: isFinishAction
		});

		if (outcome.isFinished) {
			throw redirect(303, `/results/${params.attemptId}`);
		}
		const result = outcome.isCorrect ? 'correct' : 'incorrect';
		throw redirect(303, `/play/${params.attemptId}?result=${result}`);
	}
};
