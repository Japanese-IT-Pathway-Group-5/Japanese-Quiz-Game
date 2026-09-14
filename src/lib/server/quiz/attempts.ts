import { and, eq, inArray } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { AppDb } from '$lib/server/db';
import { toClientQuestion, shuffleArray } from '$lib/quiz/toClientQuestion';
import { gradeAnswer } from '$lib/quiz/gradeAnswer';
import { calculateScore } from '$lib/quiz/calculateScore';
import type { ClientQuestion } from '$lib/quiz/types';

export const DEFAULT_QUESTION_COUNT = 10;

export type StartQuizAttemptParams = {
	playerId: string;
	nickname: string;
	level: 'N3' | 'N4';
	questionCount?: number;
};

export type GetQuizAttemptParams = {
	attemptId: string;
	playerId: string;
};

export type SubmitAttemptAnswerParams = {
	attemptId: string;
	playerId: string;
	questionId?: string;
	answer?: string | readonly string[];
	durationSeconds?: number;
	finish?: boolean;
};

export type SubmitAttemptAnswerResult = {
	isCorrect: boolean;
	isFinished: boolean;
	correctCount: number;
	currentQuestionIndex: number;
	totalQuestions: number;
	explanation: string | null;
	correctAnswer?: string | string[];
	attempt: schema.QuizAttempt;
};

export type GetQuizAttemptResult = {
	attempt: schema.QuizAttempt;
	currentQuestion: ClientQuestion | null;
	totalQuestions: number;
	isFinished: boolean;
	allQuestions: ClientQuestion[];
	answeredMap: Record<string, string>;
};

/**
 * Starts a new quiz game:
 * - Upserts the player's nickname
 * - Randomly picks a set of active questions for the chosen level
 * - Copies the nickname onto the attempt so subsequent nickname changes don't rewrite history
 * - Saves chosen questions on the attempt so refreshing does not reshuffle
 */
export async function startQuizAttempt(
	db: AppDb,
	params: StartQuizAttemptParams
): Promise<schema.QuizAttempt> {
	const trimmedNickname = params.nickname?.trim();
	if (!trimmedNickname) {
		throw new Error('Nickname is required');
	}

	if (params.level !== 'N3' && params.level !== 'N4') {
		throw new Error(`Invalid level: ${params.level}. Must be N3 or N4`);
	}

	// 1. Record / update player nickname
	await db
		.insert(schema.players)
		.values({
			id: params.playerId,
			nickname: trimmedNickname
		})
		.onConflictDoUpdate({
			target: schema.players.id,
			set: { nickname: trimmedNickname }
		});

	// 2. Fetch all active questions for the level
	const activeQuestions = await db
		.select({ id: schema.questions.id })
		.from(schema.questions)
		.where(and(eq(schema.questions.isActive, true), eq(schema.questions.level, params.level)));

	if (activeQuestions.length === 0) {
		throw new Error(`No active questions available for level ${params.level}`);
	}

	// 3. Shuffle and pick questions
	const shuffledIds = shuffleArray(activeQuestions.map((q) => q.id));
	const count = Math.min(params.questionCount ?? DEFAULT_QUESTION_COUNT, shuffledIds.length);
	const chosenQuestions = shuffledIds.slice(0, count);

	// 4. Create and store quiz attempt
	const [attempt] = await db
		.insert(schema.quizAttempts)
		.values({
			id: crypto.randomUUID(),
			playerId: params.playerId,
			nickname: trimmedNickname,
			level: params.level,
			chosenQuestions,
			currentQuestionIndex: 0,
			correctCount: 0,
			status: 'active'
		})
		.returning();

	return attempt;
}

/**
 * Retrieves a quiz attempt, all its sanitized client questions, and current answered status.
 *
 * Enforces ownership: only the player who created the attempt can read it.
 */
export async function getQuizAttempt(
	db: AppDb,
	params: GetQuizAttemptParams
): Promise<GetQuizAttemptResult> {
	const [attempt] = await db
		.select()
		.from(schema.quizAttempts)
		.where(eq(schema.quizAttempts.id, params.attemptId));

	if (!attempt) {
		throw new Error('Quiz attempt not found');
	}

	if (attempt.playerId !== params.playerId) {
		throw new Error('Unauthorized: You do not own this quiz attempt');
	}

	const totalQuestions = attempt.chosenQuestions.length;
	const isFinished =
		attempt.status === 'finished' || attempt.currentQuestionIndex >= totalQuestions;

	// Batch-fetch every chosen question and its choices in two queries instead
	// of one-at-a-time (previously ~20 sequential round trips for a 10-question
	// attempt). That loop was fragile under local D1 lock contention and could
	// silently come back one question short, desyncing the client's totalQuestions
	// from the authoritative attempt.chosenQuestions.length. See issue #31.
	const rawQuestions =
		attempt.chosenQuestions.length > 0
			? await db
					.select()
					.from(schema.questions)
					.where(inArray(schema.questions.id, attempt.chosenQuestions))
			: [];

	const rawChoices =
		attempt.chosenQuestions.length > 0
			? await db
					.select()
					.from(schema.choices)
					.where(inArray(schema.choices.questionId, attempt.chosenQuestions))
			: [];

	const questionById = new Map(rawQuestions.map((q) => [q.id, q]));
	const choicesByQuestionId = new Map<string, typeof rawChoices>();
	for (const choice of rawChoices) {
		const existing = choicesByQuestionId.get(choice.questionId) ?? [];
		existing.push(choice);
		choicesByQuestionId.set(choice.questionId, existing);
	}

	const allQuestions: ClientQuestion[] = [];
	for (const qId of attempt.chosenQuestions) {
		const rawQuestion = questionById.get(qId);
		if (rawQuestion) {
			allQuestions.push(
				toClientQuestion({
					...rawQuestion,
					choices: choicesByQuestionId.get(qId) ?? []
				})
			);
		}
	}

	const answeredRows = await db
		.select()
		.from(schema.attemptAnswers)
		.where(eq(schema.attemptAnswers.attemptId, attempt.id));

	const answeredMap: Record<string, string> = {};
	for (const row of answeredRows) {
		answeredMap[row.questionId] = row.answer;
	}

	let currentQuestion: ClientQuestion | null = null;
	if (!isFinished && attempt.status === 'active') {
		const currentQuestionId = attempt.chosenQuestions[attempt.currentQuestionIndex];
		if (currentQuestionId) {
			currentQuestion =
				allQuestions.find((q) => q.id === currentQuestionId) ?? allQuestions[0] ?? null;
		}
	}

	return {
		attempt,
		currentQuestion,
		totalQuestions,
		isFinished,
		allQuestions,
		answeredMap
	};
}

/**
 * Submits an answer for a question in the attempt (supports reviewing & updating answers):
 * - Refuses access if player does not own attempt
 * - Refuses answer if attempt is already finished
 * - Grades the answer and upserts it in attempt_answers
 * - Recalculates total correct answers
 * - Advances attempt state or marks finished
 */
export async function submitAttemptAnswer(
	db: AppDb,
	params: SubmitAttemptAnswerParams
): Promise<SubmitAttemptAnswerResult> {
	const [attempt] = await db
		.select()
		.from(schema.quizAttempts)
		.where(eq(schema.quizAttempts.id, params.attemptId));

	if (!attempt) {
		throw new Error('Quiz attempt not found');
	}

	if (attempt.playerId !== params.playerId) {
		throw new Error('Unauthorized: You do not own this quiz attempt');
	}

	if (
		attempt.status === 'finished' ||
		attempt.currentQuestionIndex >= attempt.chosenQuestions.length
	) {
		throw new Error('Quiz attempt is already finished');
	}

	const questionId = params.questionId ?? attempt.chosenQuestions[attempt.currentQuestionIndex];
	const [question] = await db
		.select()
		.from(schema.questions)
		.where(eq(schema.questions.id, questionId));

	if (!question) {
		throw new Error(`Question not found: ${questionId}`);
	}

	const questionChoices = await db
		.select()
		.from(schema.choices)
		.where(eq(schema.choices.questionId, questionId));

	let isCorrect = false;
	let explanation: string | null = null;
	let correctAnswer: string | string[] | undefined;

	if (params.answer !== undefined) {
		// Grade the answer
		const gradeResult = gradeAnswer(
			{
				...question,
				choices: questionChoices
			},
			params.answer
		);

		isCorrect = gradeResult.isCorrect;
		explanation = gradeResult.explanation ?? null;
		correctAnswer = gradeResult.correctAnswer;

		const answerString =
			typeof params.answer === 'string' ? params.answer : JSON.stringify(params.answer);

		// Check if answer already exists
		const existingAnswer = await db
			.select()
			.from(schema.attemptAnswers)
			.where(
				and(
					eq(schema.attemptAnswers.attemptId, attempt.id),
					eq(schema.attemptAnswers.questionId, question.id)
				)
			);

		if (existingAnswer.length > 0) {
			await db
				.update(schema.attemptAnswers)
				.set({
					answer: answerString,
					isCorrect,
					durationSeconds: params.durationSeconds ?? 0,
					answeredAt: new Date()
				})
				.where(eq(schema.attemptAnswers.id, existingAnswer[0].id));
		} else {
			await db.insert(schema.attemptAnswers).values({
				id: crypto.randomUUID(),
				attemptId: attempt.id,
				questionId: question.id,
				answer: answerString,
				isCorrect,
				durationSeconds: params.durationSeconds ?? 0
			});
		}
	}

	// Calculate overall correct count across all answered questions
	const allAnswers = await db
		.select()
		.from(schema.attemptAnswers)
		.where(eq(schema.attemptAnswers.attemptId, attempt.id));

	const newCorrectCount = allAnswers.filter((a) => a.isCorrect).length;
	const isFinishRequested = params.finish === true;

	// Calculate next index
	const currentIndex = attempt.chosenQuestions.indexOf(questionId);
	const nextIndex =
		currentIndex >= 0
			? Math.min(currentIndex + 1, attempt.chosenQuestions.length)
			: attempt.currentQuestionIndex + 1;
	// Reaching the end of the question list always finishes the attempt.
	// (Previously this also required allAnswers.length to have caught up,
	// which could desync currentQuestionIndex from status if an answer
	// write raced or failed to land — causing an infinite redirect loop
	// between /play and /results. See issue #31.)
	const isFinished = isFinishRequested || nextIndex >= attempt.chosenQuestions.length;

	const updateValues: Partial<typeof schema.quizAttempts.$inferInsert> = {
		currentQuestionIndex: isFinished ? attempt.chosenQuestions.length : nextIndex,
		correctCount: newCorrectCount
	};

	if (isFinished) {
		const finishedAt = new Date();
		updateValues.status = 'finished';
		updateValues.finishedAt = finishedAt;

		const started = attempt.startedAt ? new Date(attempt.startedAt) : new Date();
		const totalSeconds = Math.max(0, Math.floor((finishedAt.getTime() - started.getTime()) / 1000));
		updateValues.finalScore = calculateScore(
			newCorrectCount,
			attempt.chosenQuestions.length,
			totalSeconds
		);
	}

	const [updatedAttempt] = await db
		.update(schema.quizAttempts)
		.set(updateValues)
		.where(eq(schema.quizAttempts.id, attempt.id))
		.returning();

	return {
		isCorrect,
		isFinished,
		correctCount: newCorrectCount,
		currentQuestionIndex: nextIndex,
		totalQuestions: attempt.chosenQuestions.length,
		explanation,
		correctAnswer,
		attempt: updatedAttempt
	};
}
