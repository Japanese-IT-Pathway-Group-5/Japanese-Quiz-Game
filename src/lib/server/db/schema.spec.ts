import { describe, it, expect } from 'vitest';
import { getTableColumns } from 'drizzle-orm';
import { players, questions, choices, quizAttempts, attemptAnswers } from './schema';

describe('Database Schema', () => {
	it('defines the players table with expected columns', () => {
		const cols = getTableColumns(players);
		expect(cols.id).toBeDefined();
		expect(cols.nickname).toBeDefined();
		expect(cols.createdAt).toBeDefined();
	});

	it('defines the questions table with expected columns', () => {
		const cols = getTableColumns(questions);
		expect(cols.id).toBeDefined();
		expect(cols.level).toBeDefined();
		expect(cols.category).toBeDefined();
		expect(cols.format).toBeDefined();
		expect(cols.prompt).toBeDefined();
		expect(cols.promptJa).toBeDefined();
		expect(cols.acceptedAnswers).toBeDefined();
		expect(cols.explanation).toBeDefined();
		expect(cols.isActive).toBeDefined();
		expect(cols.createdAt).toBeDefined();
	});

	it('defines the choices table with expected columns', () => {
		const cols = getTableColumns(choices);
		expect(cols.id).toBeDefined();
		expect(cols.questionId).toBeDefined();
		expect(cols.text).toBeDefined();
		expect(cols.isCorrect).toBeDefined();
		expect(cols.order).toBeDefined();
	});

	it('defines the quiz_attempts table with expected columns', () => {
		const cols = getTableColumns(quizAttempts);
		expect(cols.id).toBeDefined();
		expect(cols.playerId).toBeDefined();
		expect(cols.nickname).toBeDefined();
		expect(cols.level).toBeDefined();
		expect(cols.chosenQuestions).toBeDefined();
		expect(cols.currentQuestionIndex).toBeDefined();
		expect(cols.correctCount).toBeDefined();
		expect(cols.finalScore).toBeDefined();
		expect(cols.startedAt).toBeDefined();
		expect(cols.finishedAt).toBeDefined();
		expect(cols.status).toBeDefined();
	});

	it('defines the attempt_answers table with expected columns', () => {
		const cols = getTableColumns(attemptAnswers);
		expect(cols.id).toBeDefined();
		expect(cols.attemptId).toBeDefined();
		expect(cols.questionId).toBeDefined();
		expect(cols.answer).toBeDefined();
		expect(cols.isCorrect).toBeDefined();
		expect(cols.durationSeconds).toBeDefined();
		expect(cols.answeredAt).toBeDefined();
	});
});
