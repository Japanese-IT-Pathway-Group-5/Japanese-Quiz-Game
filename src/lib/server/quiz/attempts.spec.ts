import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getTableName } from 'drizzle-orm';
import { startQuizAttempt, getQuizAttempt, submitAttemptAnswer } from './attempts';
import type { AppDb } from '$lib/server/db';
import type * as schema from '$lib/server/db/schema';

describe('Quiz Attempts', () => {
	let mockQuestions: schema.Question[];
	let mockChoices: schema.Choice[];
	let mockAttempts: schema.QuizAttempt[];
	let mockAttemptAnswers: schema.AttemptAnswer[];
	let mockPlayers: schema.Player[];

	let fakeDb: AppDb;

	beforeEach(() => {
		mockQuestions = [
			{
				id: 'q1',
				level: 'N4',
				category: 'vocabulary',
				format: 'multiple_choice',
				prompt: 'Question 1',
				promptJa: '問題1',
				acceptedAnswers: null,
				explanation: 'Explanation 1',
				isActive: true,
				createdAt: new Date()
			},
			{
				id: 'q2',
				level: 'N4',
				category: 'grammar',
				format: 'multiple_choice',
				prompt: 'Question 2',
				promptJa: '問題2',
				acceptedAnswers: null,
				explanation: 'Explanation 2',
				isActive: true,
				createdAt: new Date()
			}
		];

		mockChoices = [
			{ id: 'c1_1', questionId: 'q1', text: 'Correct 1', isCorrect: true, order: 0 },
			{ id: 'c1_2', questionId: 'q1', text: 'Wrong 1', isCorrect: false, order: 1 },
			{ id: 'c2_1', questionId: 'q2', text: 'Correct 2', isCorrect: true, order: 0 },
			{ id: 'c2_2', questionId: 'q2', text: 'Wrong 2', isCorrect: false, order: 1 }
		];

		mockAttempts = [];
		mockAttemptAnswers = [];
		mockPlayers = [];

		fakeDb = {
			insert: vi.fn((table: unknown) => ({
				values: vi.fn((val: unknown) => {
					const data = (Array.isArray(val) ? val : [val]) as Record<string, unknown>[];
					const tableName = getTableName(table as Parameters<typeof getTableName>[0]);
					if (tableName === 'quiz_attempts') {
						mockAttempts.push(...(data as unknown as schema.QuizAttempt[]));
					} else if (tableName === 'attempt_answers') {
						mockAttemptAnswers.push(...(data as unknown as schema.AttemptAnswer[]));
					} else if (tableName === 'players') {
						mockPlayers.push(...(data as unknown as schema.Player[]));
					}
					return {
						onConflictDoUpdate: vi.fn(() => Promise.resolve()),
						returning: vi.fn(() => Promise.resolve(data))
					};
				})
			})),

			select: vi.fn(() => ({
				from: vi.fn((table: unknown) => ({
					where: vi.fn(() => {
						const tableName = getTableName(table as Parameters<typeof getTableName>[0]);
						if (tableName === 'questions') {
							return Promise.resolve(mockQuestions);
						}
						if (tableName === 'choices') {
							return Promise.resolve(mockChoices);
						}
						if (tableName === 'quiz_attempts') {
							return Promise.resolve(mockAttempts);
						}
						return Promise.resolve([]);
					})
				}))
			})),

			update: vi.fn(() => ({
				set: vi.fn((values: Record<string, unknown>) => ({
					where: vi.fn(() => ({
						returning: vi.fn(() => {
							if (mockAttempts.length > 0) {
								Object.assign(mockAttempts[0], values);
								return Promise.resolve([mockAttempts[0]]);
							}
							return Promise.resolve([values]);
						})
					}))
				}))
			}))
		} as unknown as AppDb;
	});

	describe('startQuizAttempt', () => {
		it('picks active questions at the chosen level, sets nickname, and saves attempt', async () => {
			const attempt = await startQuizAttempt(fakeDb, {
				playerId: 'player-1',
				nickname: 'Kenji',
				level: 'N4',
				questionCount: 2
			});

			expect(attempt.id).toBeDefined();
			expect(attempt.playerId).toBe('player-1');
			expect(attempt.nickname).toBe('Kenji');
			expect(attempt.level).toBe('N4');
			expect(attempt.currentQuestionIndex).toBe(0);
			expect(attempt.correctCount).toBe(0);
			expect(attempt.status).toBe('active');
			expect(attempt.chosenQuestions).toHaveLength(2);
			expect(mockAttempts).toContain(attempt);
		});

		it('rejects empty or whitespace-only nicknames', async () => {
			await expect(
				startQuizAttempt(fakeDb, {
					playerId: 'player-1',
					nickname: '   ',
					level: 'N4'
				})
			).rejects.toThrow('Nickname is required');
		});

		it('rejects invalid levels', async () => {
			await expect(
				startQuizAttempt(fakeDb, {
					playerId: 'player-1',
					nickname: 'Kenji',
					level: 'N1' as unknown as 'N3'
				})
			).rejects.toThrow('Invalid level');
		});
	});

	describe('getQuizAttempt', () => {
		it('returns attempt and sanitized current question', async () => {
			mockAttempts.push({
				id: 'attempt-1',
				playerId: 'player-1',
				nickname: 'Kenji',
				level: 'N4',
				chosenQuestions: ['q1', 'q2'],
				currentQuestionIndex: 0,
				correctCount: 0,
				finalScore: null,
				startedAt: new Date(),
				finishedAt: null,
				status: 'active'
			});

			const result = await getQuizAttempt(fakeDb, {
				attemptId: 'attempt-1',
				playerId: 'player-1'
			});

			expect(result.attempt.id).toBe('attempt-1');
			expect(result.totalQuestions).toBe(2);
			expect(result.isFinished).toBe(false);
			expect(result.currentQuestion).toBeDefined();
			expect(result.currentQuestion?.id).toBe('q1');
			// Anti-cheating check: choice must not have isCorrect
			expect('isCorrect' in (result.currentQuestion?.choices?.[0] ?? {})).toBe(false);
		});

		it('refuses access when read by a different player', async () => {
			mockAttempts.push({
				id: 'attempt-1',
				playerId: 'player-1',
				nickname: 'Kenji',
				level: 'N4',
				chosenQuestions: ['q1'],
				currentQuestionIndex: 0,
				correctCount: 0,
				finalScore: null,
				startedAt: new Date(),
				finishedAt: null,
				status: 'active'
			});

			await expect(
				getQuizAttempt(fakeDb, {
					attemptId: 'attempt-1',
					playerId: 'another-player'
				})
			).rejects.toThrow('Unauthorized');
		});
	});

	describe('submitAttemptAnswer', () => {
		it('records answer, increments correctCount on correct answer, and moves index forward', async () => {
			const attempt: schema.QuizAttempt = {
				id: 'attempt-1',
				playerId: 'player-1',
				nickname: 'Kenji',
				level: 'N4',
				chosenQuestions: ['q1', 'q2'],
				currentQuestionIndex: 0,
				correctCount: 0,
				finalScore: null,
				startedAt: new Date(),
				finishedAt: null,
				status: 'active'
			};
			mockAttempts.push(attempt);

			const outcome = await submitAttemptAnswer(fakeDb, {
				attemptId: 'attempt-1',
				playerId: 'player-1',
				answer: 'c1_1', // correct choice for q1
				durationSeconds: 3
			});

			expect(outcome.isCorrect).toBe(true);
			expect(outcome.correctCount).toBe(1);
			expect(outcome.currentQuestionIndex).toBe(1);
			expect(outcome.isFinished).toBe(false);
			expect(fakeDb.insert).toHaveBeenCalled();
			expect(fakeDb.update).toHaveBeenCalled();
		});

		it('refuses submission from another player', async () => {
			mockAttempts.push({
				id: 'attempt-1',
				playerId: 'player-1',
				nickname: 'Kenji',
				level: 'N4',
				chosenQuestions: ['q1'],
				currentQuestionIndex: 0,
				correctCount: 0,
				finalScore: null,
				startedAt: new Date(),
				finishedAt: null,
				status: 'active'
			});

			await expect(
				submitAttemptAnswer(fakeDb, {
					attemptId: 'attempt-1',
					playerId: 'hacker-player',
					answer: 'c1_1'
				})
			).rejects.toThrow('Unauthorized');
		});

		it('refuses submission on an already finished attempt', async () => {
			mockAttempts.push({
				id: 'attempt-1',
				playerId: 'player-1',
				nickname: 'Kenji',
				level: 'N4',
				chosenQuestions: ['q1'],
				currentQuestionIndex: 1,
				correctCount: 1,
				finalScore: 100,
				startedAt: new Date(),
				finishedAt: new Date(),
				status: 'finished'
			});

			await expect(
				submitAttemptAnswer(fakeDb, {
					attemptId: 'attempt-1',
					playerId: 'player-1',
					answer: 'c1_1'
				})
			).rejects.toThrow('already finished');
		});

		it('marks attempt finished and records finishedAt on the final question', async () => {
			const attempt: schema.QuizAttempt = {
				id: 'attempt-1',
				playerId: 'player-1',
				nickname: 'Kenji',
				level: 'N4',
				chosenQuestions: ['q1'], // only 1 question
				currentQuestionIndex: 0,
				correctCount: 0,
				finalScore: null,
				startedAt: new Date(),
				finishedAt: null,
				status: 'active'
			};
			mockAttempts.push(attempt);

			const outcome = await submitAttemptAnswer(fakeDb, {
				attemptId: 'attempt-1',
				playerId: 'player-1',
				answer: 'c1_1',
				durationSeconds: 5
			});

			expect(outcome.isFinished).toBe(true);
			expect(attempt.status).toBe('finished');
			expect(attempt.finishedAt).toBeInstanceOf(Date);
		});
	});
});
