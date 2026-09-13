import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { quizAttempts, attemptAnswers, questions, choices } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals, platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	if (!locals.playerId) {
		throw redirect(303, '/');
	}

	if (!platform?.env?.DB) {
		throw error(
			500,
			'Database binding (DB) is unavailable. Run `npm run preview` to test with Cloudflare D1.'
		);
	}

	const db = getDb(platform.env.DB);
	const [attempt] = await db
		.select()
		.from(quizAttempts)
		.where(eq(quizAttempts.id, params.attemptId));

	if (!attempt) {
		throw redirect(303, '/');
	}

	if (attempt.playerId !== locals.playerId) {
		throw redirect(303, '/');
	}

	if (attempt.status !== 'finished') {
		throw redirect(303, `/play/${attempt.id}`);
	}

	// Load all submitted answers
	const answers = await db
		.select({
			questionId: attemptAnswers.questionId,
			answer: attemptAnswers.answer,
			isCorrect: attemptAnswers.isCorrect,
			durationSeconds: attemptAnswers.durationSeconds,
			prompt: questions.prompt,
			promptJa: questions.promptJa,
			explanation: questions.explanation,
			format: questions.format,
			acceptedAnswers: questions.acceptedAnswers
		})
		.from(attemptAnswers)
		.innerJoin(questions, eq(attemptAnswers.questionId, questions.id))
		.where(eq(attemptAnswers.attemptId, attempt.id));

	const questionIds = answers.map((answer) => answer.questionId);

	const allChoices =
		questionIds.length > 0
			? await db
					.select({
						id: choices.id,
						questionId: choices.questionId,
						text: choices.text,
						isCorrect: choices.isCorrect,
						order: choices.order
					})
					.from(choices)
					.where(inArray(choices.questionId, questionIds))
			: [];

	const choiceMap = new Map<string, string>();
	const correctChoiceMap = new Map<string, string[]>();
	const orderedChoiceMap = new Map<string, { text: string; order: number }[]>();

	for (const choice of allChoices) {
		choiceMap.set(choice.id, choice.text);

		if (choice.isCorrect) {
			const existing = correctChoiceMap.get(choice.questionId) ?? [];
			existing.push(choice.text);
			correctChoiceMap.set(choice.questionId, existing);
		}

		const orderedChoices = orderedChoiceMap.get(choice.questionId) ?? [];
		orderedChoices.push({
			text: choice.text,
			order: choice.order
		});
		orderedChoiceMap.set(choice.questionId, orderedChoices);
	}

	for (const [questionId, orderedChoices] of orderedChoiceMap) {
		orderedChoices.sort((a, b) => a.order - b.order);
		orderedChoiceMap.set(questionId, orderedChoices);
	}

	const questionResults = answers.map((answer) => {
		const isChoiceQuestion = answer.format === 'multiple_choice' || answer.format === 'gap_fill';
		const isWordOrdering = answer.format === 'word_ordering';

		let playerAnswer = answer.answer;
		let correctAnswers: string[] = [];

		if (isChoiceQuestion) {
			playerAnswer = choiceMap.get(answer.answer) ?? answer.answer;
			correctAnswers = correctChoiceMap.get(answer.questionId) ?? [];
		}

		if (isWordOrdering) {
			try {
				const playerWords = JSON.parse(answer.answer);
				if (Array.isArray(playerWords)) {
					playerAnswer = playerWords.join(' ');
				}
			} catch {
				playerAnswer = answer.answer;
			}

			const orderedChoices = orderedChoiceMap.get(answer.questionId) ?? [];
			correctAnswers =
				orderedChoices.length > 0 ? [orderedChoices.map((choice) => choice.text).join(' ')] : [];
		}

		if (answer.format === 'typing') {
			correctAnswers = answer.acceptedAnswers ?? [];
		}

		return {
			questionId: answer.questionId,
			prompt: answer.prompt,
			promptJa: answer.promptJa,
			format: answer.format,
			answer: playerAnswer,
			isCorrect: answer.isCorrect,
			durationSeconds: answer.durationSeconds,
			explanation: answer.explanation,
			correctAnswers
		};
	});

	if (Array.isArray(attempt.chosenQuestions)) {
		questionResults.sort((a, b) => {
			const idxA = attempt.chosenQuestions.indexOf(a.questionId);
			const idxB = attempt.chosenQuestions.indexOf(b.questionId);
			return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
		});
	}

	return {
		attempt,
		questionResults
	};
};
