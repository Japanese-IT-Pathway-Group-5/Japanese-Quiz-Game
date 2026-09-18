import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { quizAttempts, attemptAnswers, questions, choices, players } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { calculateScore } from '$lib/quiz/calculateScore';

export const load: PageServerLoad = async ({ params, locals, platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	// Only the player who owns the attempt can view its results.
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

	// Prevent players from opening another player's results.
	if (attempt.playerId !== locals.playerId) {
		throw redirect(303, '/');
	}

	// Correct answers must only be available after the quiz is finished.
	// If the attempt is active but all questions are answered, auto-finalize it here to avoid any redirect loops.
	if (attempt.status !== 'finished') {
		const totalQuestions = attempt.chosenQuestions.length;
		const existingAnswers = await db
			.select()
			.from(attemptAnswers)
			.where(eq(attemptAnswers.attemptId, attempt.id));

		if (
			existingAnswers.length >= totalQuestions ||
			attempt.currentQuestionIndex >= totalQuestions
		) {
			const finishedAt = new Date();
			const correctCount = existingAnswers.filter((a) => a.isCorrect).length;
			const started = attempt.startedAt ? new Date(attempt.startedAt) : new Date();
			const timeTaken = Math.max(0, Math.floor((finishedAt.getTime() - started.getTime()) / 1000));
			const finalScore = calculateScore(correctCount, totalQuestions, timeTaken);

			await db
				.update(quizAttempts)
				.set({
					status: 'finished',
					finishedAt,
					correctCount,
					finalScore,
					currentQuestionIndex: totalQuestions
				})
				.where(eq(quizAttempts.id, attempt.id));

			attempt.status = 'finished';
			attempt.finishedAt = finishedAt;
			attempt.correctCount = correctCount;
			attempt.finalScore = finalScore;
		} else {
			throw redirect(303, `/play/${attempt.id}`);
		}
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
			promptJa: questions.promptJa,
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
		// Convert choice ID -> readable choice text.
		choiceMap.set(choice.id, choice.text);

		// Store correct choices for multiple-choice/gap-fill.
		if (choice.isCorrect) {
			const existing = correctChoiceMap.get(choice.questionId) ?? [];
			existing.push(choice.text);
			correctChoiceMap.set(choice.questionId, existing);
		}

		// Store choices for reconstructing word-ordering answers.
		const orderedChoices = orderedChoiceMap.get(choice.questionId) ?? [];

		orderedChoices.push({
			text: choice.text,
			order: choice.order
		});

		orderedChoiceMap.set(choice.questionId, orderedChoices);
	}

	// Sort each question's choices using the database order.
	for (const [questionId, orderedChoices] of orderedChoiceMap) {
		orderedChoices.sort((a, b) => a.order - b.order);
		orderedChoiceMap.set(questionId, orderedChoices);
	}

	const questionResults = answers.map((answer) => {
		const isChoiceQuestion = answer.format === 'multiple_choice' || answer.format === 'gap_fill';

		const isWordOrdering = answer.format === 'word_ordering';

		let playerAnswer = answer.answer;
		let correctAnswers: string[] = [];

		/*
		 * Multiple-choice / gap-fill:
		 *
		 * The database stores the selected choice ID.
		 * Convert it to the actual choice text.
		 */
		if (isChoiceQuestion) {
			playerAnswer = choiceMap.get(answer.answer) ?? answer.answer;

			correctAnswers = correctChoiceMap.get(answer.questionId) ?? [];
		}

		/*
		 * Word ordering:
		 *
		 * The player's answer is stored as JSON, for example:
		 *
		 * ["日本語を","上手に","話せるように","なります。"]
		 *
		 * Convert it to readable text.
		 *
		 * The correct answer is reconstructed from choices.order.
		 */
		if (isWordOrdering) {
			try {
				const playerWords = JSON.parse(answer.answer);

				if (Array.isArray(playerWords)) {
					playerAnswer = playerWords.join(' ');
				}
			} catch {
				// Keep the original answer if it is not valid JSON.
				playerAnswer = answer.answer;
			}

			const orderedChoices = orderedChoiceMap.get(answer.questionId) ?? [];

			correctAnswers =
				orderedChoices.length > 0 ? [orderedChoices.map((choice) => choice.text).join(' ')] : [];
		}

		/*
		 * Typing:
		 *
		 * Keep the player's typed answer as-is.
		 * acceptedAnswers contains the valid answers.
		 */
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

	// Sort question results by the attempt's chosen questions order
	if (Array.isArray(attempt.chosenQuestions)) {
		questionResults.sort((a, b) => {
			const idxA = attempt.chosenQuestions.indexOf(a.questionId);
			const idxB = attempt.chosenQuestions.indexOf(b.questionId);
			return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
		});
	}

	const timeTaken =
		attempt.finishedAt && attempt.startedAt
			? Math.max(0, Math.round((attempt.finishedAt.getTime() - attempt.startedAt.getTime()) / 1000))
			: 0;

	const [player] = await db.select().from(players).where(eq(players.id, attempt.playerId));
	const isSavedToAccount = Boolean(player?.googleId && !player?.isAnonymous);

	return {
		attempt,
		timeTaken,
		questionResults,
		player: player ?? null,
		isSavedToAccount
	};
};
