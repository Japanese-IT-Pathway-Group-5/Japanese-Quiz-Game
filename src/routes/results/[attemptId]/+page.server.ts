import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { quizAttempts, attemptAnswers, questions, choices } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { calculateScore } from '$lib/quiz/calculateScore';

export const load: PageServerLoad = async ({ params, locals, platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	// Only the player who owns the attempt can view its results.
	if (!locals.playerId) {
		throw error(403, 'This game does not belong to this player.');
	}

	const db = getDb(platform!.env.DB);

	const [attempt] = await db
		.select()
		.from(quizAttempts)
		.where(eq(quizAttempts.id, params.attemptId));

	if (!attempt) {
		throw error(404, 'Game not found.');
	}

	// Prevent players from opening another player's results.
	if (attempt.playerId !== locals.playerId) {
		throw error(403, 'This game does not belong to this player.');
	}

	// Correct answers must only be available after the quiz is finished.
	if (attempt.status !== 'finished') {
		throw redirect(303, `/play/${attempt.id}`);
	}

	// Calculate and save the final score if it has not already been calculated.
	if (attempt.finalScore === null) {
		const totalQuestions = attempt.chosenQuestions.length;

		const timeTaken =
			attempt.finishedAt && attempt.startedAt
				? Math.max(
						0,
						Math.round((attempt.finishedAt.getTime() - attempt.startedAt.getTime()) / 1000)
					)
				: 0;

		const finalScore = calculateScore(attempt.correctCount, totalQuestions, timeTaken);

		await db.update(quizAttempts).set({ finalScore }).where(eq(quizAttempts.id, attempt.id));

		attempt.finalScore = finalScore;
	}

	// Load all answers submitted by the player.
	const answers = await db
		.select({
			questionId: attemptAnswers.questionId,
			answer: attemptAnswers.answer,
			isCorrect: attemptAnswers.isCorrect,
			durationSeconds: attemptAnswers.durationSeconds,
			prompt: questions.prompt,
			explanation: questions.explanation,
			format: questions.format,
			acceptedAnswers: questions.acceptedAnswers
		})
		.from(attemptAnswers)
		.innerJoin(questions, eq(attemptAnswers.questionId, questions.id))
		.where(eq(attemptAnswers.attemptId, attempt.id));

	const questionIds = answers.map((answer) => answer.questionId);

	/*
	 * Load all choices used by these questions.
	 *
	 * We need:
	 *
	 * 1. choiceMap
	 *    Converts a stored choice ID into readable text.
	 *
	 * 2. correctChoiceMap
	 *    Gets the correct answer for multiple-choice/gap-fill.
	 *
	 * 3. orderedChoiceMap
	 *    Reconstructs the correct word-ordering sentence using
	 *    the choice "order" value.
	 */
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
			answer: playerAnswer,
			isCorrect: answer.isCorrect,
			durationSeconds: answer.durationSeconds,
			explanation: answer.explanation,
			correctAnswers
		};
	});

	const timeTaken =
		attempt.finishedAt && attempt.startedAt
			? Math.max(0, Math.round((attempt.finishedAt.getTime() - attempt.startedAt.getTime()) / 1000))
			: 0;

	return {
		attempt,
		timeTaken,
		questionResults
	};
};
