import { and, eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import type { AppDb } from '$lib/server/db';
import { toClientQuestion, shuffleArray } from '$lib/quiz/toClientQuestion';
import { gradeAnswer } from '$lib/quiz/gradeAnswer';
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
	answer: string | readonly string[];
	durationSeconds?: number;
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
 * Retrieves a quiz attempt and its sanitized current question.
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

	let currentQuestion: ClientQuestion | null = null;

	if (!isFinished && attempt.status === 'active') {
		const currentQuestionId = attempt.chosenQuestions[attempt.currentQuestionIndex];
		if (currentQuestionId) {
			const [rawQuestion] = await db
				.select()
				.from(schema.questions)
				.where(eq(schema.questions.id, currentQuestionId));

			if (rawQuestion) {
				const rawChoices = await db
					.select()
					.from(schema.choices)
					.where(eq(schema.choices.questionId, currentQuestionId));

				currentQuestion = toClientQuestion({
					...rawQuestion,
					choices: rawChoices
				});
			}
		}
	}

	return {
		attempt,
		currentQuestion,
		totalQuestions,
		isFinished
	};
}

/**
 * Submits an answer for the current question:
 * - Refuses access if player does not own attempt
 * - Refuses answer if attempt is already finished
 * - Grades the answer and records it in attempt_answers
 * - Advances attempt by 1 question and increments correctCount
 * - If last question, marks attempt finished and sets finishedAt
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

	const questionId = attempt.chosenQuestions[attempt.currentQuestionIndex];
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

	// Grade the answer
	const gradeResult = gradeAnswer(
		{
			...question,
			choices: questionChoices
		},
		params.answer
	);

	// Record answer in attempt_answers
	const answerString =
		typeof params.answer === 'string' ? params.answer : JSON.stringify(params.answer);

	await db.insert(schema.attemptAnswers).values({
		id: crypto.randomUUID(),
		attemptId: attempt.id,
		questionId: question.id,
		answer: answerString,
		isCorrect: gradeResult.isCorrect,
		durationSeconds: params.durationSeconds ?? 0
	});

	// Advance attempt state
	const nextIndex = attempt.currentQuestionIndex + 1;
	const newCorrectCount = gradeResult.isCorrect ? attempt.correctCount + 1 : attempt.correctCount;
	const isFinished = nextIndex >= attempt.chosenQuestions.length;

	const updateValues: Partial<typeof schema.quizAttempts.$inferInsert> = {
		currentQuestionIndex: nextIndex,
		correctCount: newCorrectCount
	};

	if (isFinished) {
		updateValues.status = 'finished';
		updateValues.finishedAt = new Date();
	}

	const [updatedAttempt] = await db
		.update(schema.quizAttempts)
		.set(updateValues)
		.where(eq(schema.quizAttempts.id, attempt.id))
		.returning();

	return {
		isCorrect: gradeResult.isCorrect,
		isFinished,
		correctCount: newCorrectCount,
		currentQuestionIndex: nextIndex,
		totalQuestions: attempt.chosenQuestions.length,
		explanation: gradeResult.explanation ?? null,
		correctAnswer: gradeResult.correctAnswer,
		attempt: updatedAttempt
	};
}
