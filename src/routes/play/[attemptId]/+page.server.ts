import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { normalizeTypedAnswer } from '$lib/quiz/normalizeTypedAnswer';
import { getDb } from '$lib/server/db';
import { attemptAnswers, choices, questions, quizAttempts } from '$lib/server/db/schema';

const getCurrentQuestion = async (
	db: ReturnType<typeof getDb>,
	attempt: Awaited<ReturnType<typeof getAttempt>>
) => {
	if (attempt.chosenQuestions.length === 0) {
		throw redirect(303, `/results/${attempt.id}`);
	}

	const questionIndex = attempt.currentQuestionIndex;
	const questionId = attempt.chosenQuestions[questionIndex];

	if (!questionId) {
		throw redirect(303, `/results/${attempt.id}`);
	}

	const [question] = await db.select().from(questions).where(eq(questions.id, questionId));

	if (!question) {
		throw error(404, 'Question not found for this game.');
	}

	const rows = await db.select().from(choices).where(eq(choices.questionId, questionId));

	return {
		...question,
		choices: [...rows].sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
	};
};

const getAttempt = async (db: ReturnType<typeof getDb>, attemptId: string) => {
	const [attempt] = await db.select().from(quizAttempts).where(eq(quizAttempts.id, attemptId));

	if (!attempt) {
		throw error(404, 'Game not found.');
	}

	return attempt;
};

const getQuestionAnswer = (
	question: Awaited<ReturnType<typeof getCurrentQuestion>>,
	formData: FormData
) => {
	if (question.format === 'typing') {
		const rawValue = formData.get('answer');

		if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
			throw error(400, 'Please enter your answer.');
		}

		const normalized = normalizeTypedAnswer(rawValue);
		const acceptedAnswers = question.acceptedAnswers ?? [];

		return {
			submittedAnswer: normalized,
			isCorrect: acceptedAnswers.some((acceptedAnswer) => {
				const normalizedAccepted = normalizeTypedAnswer(acceptedAnswer);
				return normalizedAccepted === normalized;
			})
		};
	}

	if (question.format === 'word_ordering') {
		const values = question.choices.map((choice, index) => {
			const rawValue = formData.get(`answer-${index}`);
			return typeof rawValue === 'string' ? rawValue : '';
		});

		if (values.some((value) => value.length === 0)) {
			throw error(400, 'Please choose every word in the sentence.');
		}

		const submittedAnswer = values.join(' ');
		const expectedAnswer = question.choices.map((choice) => choice.text).join(' ');

		return {
			submittedAnswer,
			isCorrect: submittedAnswer === expectedAnswer
		};
	}

	const rawValue = formData.get('answer');

	if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
		throw error(400, 'Please make a selection.');
	}

	if (question.format === 'multiple_choice' || question.format === 'gap_fill') {
		const choice = question.choices.find((item) => item.id === rawValue);
		const isCorrect = Boolean(choice?.isCorrect);

		return {
			submittedAnswer: choice?.text ?? rawValue,
			isCorrect
		};
	}

	throw error(400, 'Unsupported question format.');
};

export const load: PageServerLoad = async ({ params, locals, platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	const db = getDb(platform!.env.DB);
	const attempt = await getAttempt(db, params.attemptId);

	if (attempt.playerId !== locals.playerId) {
		throw error(403, 'This game does not belong to this player.');
	}

	if (attempt.status === 'finished') {
		throw redirect(303, `/results/${attempt.id}`);
	}

	if (attempt.status === 'abandoned') {
		throw error(403, 'This game is no longer active.');
	}

	const question = await getCurrentQuestion(db, attempt);

	return {
		attempt: {
			...attempt,
			chosenQuestions: attempt.chosenQuestions ?? []
		},
		question
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals, platform }) => {
		const db = getDb(platform!.env.DB);
		const attempt = await getAttempt(db, params.attemptId);

		if (attempt.playerId !== locals.playerId) {
			throw error(403, 'This game does not belong to this player.');
		}

		if (attempt.status === 'finished') {
			throw redirect(303, `/results/${attempt.id}`);
		}

		if (attempt.status === 'abandoned') {
			throw error(403, 'This game is no longer active.');
		}

		const question = await getCurrentQuestion(db, attempt);
		const formData = await request.formData();
		const submittedQuestionId = formData.get('questionId');

		if (submittedQuestionId !== question.id) {
			throw error(400, 'This question is no longer available to answer.');
		}

		const submission = getQuestionAnswer(question, formData);
		const existingAnswer = await db
			.select()
			.from(attemptAnswers)
			.where(
				and(eq(attemptAnswers.attemptId, attempt.id), eq(attemptAnswers.questionId, question.id))
			);

		if (existingAnswer.length > 0) {
			throw redirect(
				303,
				attempt.currentQuestionIndex + 1 >= attempt.chosenQuestions.length
					? `/results/${attempt.id}`
					: `/play/${attempt.id}`
			);
		}

		const nextQuestionIndex = attempt.currentQuestionIndex + 1;
		const nextCorrectCount = attempt.correctCount + (submission.isCorrect ? 1 : 0);
		const isLastQuestion = nextQuestionIndex >= attempt.chosenQuestions.length;

		await db.insert(attemptAnswers).values({
			attemptId: attempt.id,
			questionId: question.id,
			answer: submission.submittedAnswer,
			isCorrect: submission.isCorrect,
			durationSeconds: 0,
			answeredAt: new Date()
		});

		await db
			.update(quizAttempts)
			.set({
				currentQuestionIndex: nextQuestionIndex,
				correctCount: nextCorrectCount,
				finalScore: nextCorrectCount,
				finishedAt: isLastQuestion ? new Date() : null,
				status: isLastQuestion ? 'finished' : 'active'
			})
			.where(eq(quizAttempts.id, attempt.id));

		if (isLastQuestion) {
			throw redirect(303, `/results/${attempt.id}`);
		}

		throw redirect(303, `/play/${attempt.id}`);
	}
};
