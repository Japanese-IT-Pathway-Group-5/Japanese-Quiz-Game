import { describe, expect, it } from 'vitest';
import { toClientQuestion, toClientQuestions } from './toClientQuestion';
import type { StoredChoice, StoredQuestion } from './types';

describe('toClientQuestion', () => {
	it('converts a multiple-choice question and strips isCorrect and explanation', () => {
		const stored: StoredQuestion = {
			id: 'q_n4_mc_01',
			level: 'N4',
			category: 'vocabulary',
			format: 'multiple_choice',
			prompt: 'What is the meaning of 「案内する」?',
			promptJa: '案内する',
			explanation: '「案内する」 means to guide or show around.',
			acceptedAnswers: null,
			isActive: true,
			createdAt: new Date(),
			choices: [
				{
					id: 'c1',
					questionId: 'q_n4_mc_01',
					text: 'To guide / show around',
					isCorrect: true,
					order: 0
				},
				{ id: 'c2', questionId: 'q_n4_mc_01', text: 'To invite', isCorrect: false, order: 1 },
				{ id: 'c3', questionId: 'q_n4_mc_01', text: 'To prepare', isCorrect: false, order: 2 }
			]
		};

		const client = toClientQuestion(stored);

		expect(client.id).toBe('q_n4_mc_01');
		expect(client.level).toBe('N4');
		expect(client.category).toBe('vocabulary');
		expect(client.format).toBe('multiple_choice');
		expect(client.prompt).toBe('What is the meaning of 「案内する」?');
		expect(client.promptJa).toBe('案内する');

		// Choices must only have id and text
		expect(client.choices).toEqual([
			{ id: 'c1', text: 'To guide / show around' },
			{ id: 'c2', text: 'To invite' },
			{ id: 'c3', text: 'To prepare' }
		]);

		// Explicit anti-cheating proofs:
		expect('explanation' in client).toBe(false);
		expect('acceptedAnswers' in client).toBe(false);
		expect('isActive' in client).toBe(false);
		expect('createdAt' in client).toBe(false);

		client.choices?.forEach((choice) => {
			expect('isCorrect' in choice).toBe(false);
			expect('order' in choice).toBe(false);
			expect('questionId' in choice).toBe(false);
		});
	});

	it('converts a typing question and removes acceptedAnswers and explanation', () => {
		const stored: StoredQuestion = {
			id: 'q_n4_ty_01',
			level: 'N4',
			category: 'vocabulary',
			format: 'typing',
			prompt: 'Type the hiragana reading for the word:',
			promptJa: '週末',
			acceptedAnswers: ['しゅうまつ', 'shuumatsu'],
			explanation: '「週末」 is read 「しゅうまつ」.',
			choices: []
		};

		const client = toClientQuestion(stored);

		expect(client.id).toBe('q_n4_ty_01');
		expect(client.format).toBe('typing');
		expect(client.prompt).toBe('Type the hiragana reading for the word:');
		expect(client.promptJa).toBe('週末');
		expect(client.choices).toBeUndefined();

		// None of the answer fields or explanations must exist
		expect('acceptedAnswers' in client).toBe(false);
		expect('explanation' in client).toBe(false);
		expect(JSON.stringify(client)).not.toContain('しゅうまつ');
		expect(JSON.stringify(client)).not.toContain('shuumatsu');
	});

	it('converts gap_fill questions and removes answers and explanations', () => {
		const stored: StoredQuestion = {
			id: 'q_n4_gf_01',
			level: 'N4',
			category: 'grammar',
			format: 'gap_fill',
			prompt: 'Choose the correct particle for the blank.',
			promptJa: '日曜日 [ ___ ] 友達と映画を見に行きます。',
			explanation: 'Specific time expressions take the particle に.',
			choices: [
				{ id: 'c1', text: 'に', isCorrect: true, order: 0 },
				{ id: 'c2', text: 'で', isCorrect: false, order: 1 }
			]
		};

		const client = toClientQuestion(stored);

		expect(client.choices).toEqual([
			{ id: 'c1', text: 'に' },
			{ id: 'c2', text: 'で' }
		]);
		expect('explanation' in client).toBe(false);
		expect('isCorrect' in (client.choices?.[0] ?? {})).toBe(false);
	});

	it('returns word ordering options shuffled and not in their correct order', () => {
		const stored: StoredQuestion = {
			id: 'q_n4_wo_01',
			level: 'N4',
			category: 'grammar',
			format: 'word_ordering',
			prompt: 'Arrange the words in correct order.',
			promptJa: '私は日本語 [ 1 ] [ 2 ] [ 3 ] なりたいです。',
			explanation: 'The pattern is: を + 上手に + 話せるように.',
			choices: [
				{ id: 'c1', text: 'を', isCorrect: true, order: 0 },
				{ id: 'c2', text: '上手に', isCorrect: true, order: 1 },
				{ id: 'c3', text: '話せるように', isCorrect: true, order: 2 }
			]
		};

		const client = toClientQuestion(stored);

		expect(client.choices).toBeDefined();
		expect(client.choices?.length).toBe(3);

		// Every choice must only contain id and text
		client.choices?.forEach((choice) => {
			expect(Object.keys(choice).sort()).toEqual(['id', 'text']);
		});

		// The choices must not be in the original stored order ['c1', 'c2', 'c3']
		const returnedIds = client.choices?.map((c) => c.id);
		expect(returnedIds).not.toEqual(['c1', 'c2', 'c3']);

		// The choices must still contain all elements
		expect(returnedIds?.sort()).toEqual(['c1', 'c2', 'c3']);
	});

	it('supports a custom shuffle function for deterministic word ordering tests', () => {
		const stored: StoredQuestion = {
			id: 'q_wo',
			format: 'word_ordering',
			prompt: 'Arrange words',
			choices: [
				{ id: 'c1', text: 'word1', order: 0 },
				{ id: 'c2', text: 'word2', order: 1 },
				{ id: 'c3', text: 'word3', order: 2 }
			]
		};

		// Custom reverse shuffle
		const customShuffle = <T>(items: readonly T[]): readonly T[] => [...items].reverse();
		const client = toClientQuestion(stored, customShuffle);

		expect(client.choices?.map((c) => c.id)).toEqual(['c3', 'c2', 'c1']);
	});

	it('strictly ensures only allowed keys exist in the client question', () => {
		const storedWithExtraneousData: StoredQuestion & Record<string, unknown> = {
			id: 'q_leak_test',
			level: 'N3',
			category: 'kanji',
			format: 'multiple_choice',
			prompt: 'Prompt',
			promptJa: '日本語',
			acceptedAnswers: ['secret answer 1', 'secret answer 2'],
			explanation: 'Top secret explanation that gives away the answer',
			isActive: true,
			createdAt: new Date(),
			secretBackendToken: 'do_not_leak',
			answerKey: 'c1',
			choices: [
				{
					id: 'c1',
					questionId: 'q_leak_test',
					text: 'Option 1',
					isCorrect: true,
					order: 0,
					secretWeight: 100
				} as unknown as StoredChoice
			]
		};

		const client = toClientQuestion(storedWithExtraneousData);
		const serialized = JSON.stringify(client);

		// Check serialized JSON doesn't contain forbidden words
		expect(serialized).not.toContain('secret');
		expect(serialized).not.toContain('isCorrect');
		expect(serialized).not.toContain('explanation');
		expect(serialized).not.toContain('acceptedAnswers');
		expect(serialized).not.toContain('answerKey');
		expect(serialized).not.toContain('secretBackendToken');

		// Allowed keys whitelist check on client question
		const allowedQuestionKeys = [
			'id',
			'level',
			'category',
			'format',
			'prompt',
			'promptJa',
			'choices'
		];
		Object.keys(client).forEach((key) => {
			expect(allowedQuestionKeys).toContain(key);
		});

		// Allowed keys whitelist check on choices
		const allowedChoiceKeys = ['id', 'text'];
		client.choices?.forEach((choice) => {
			Object.keys(choice).forEach((key) => {
				expect(allowedChoiceKeys).toContain(key);
			});
		});
	});

	it('batch converts multiple questions using toClientQuestions', () => {
		const questions: StoredQuestion[] = [
			{
				id: 'q1',
				format: 'multiple_choice',
				prompt: 'Q1',
				explanation: 'Secret 1',
				choices: [{ id: 'c1', text: 'T1', isCorrect: true }]
			},
			{
				id: 'q2',
				format: 'typing',
				prompt: 'Q2',
				acceptedAnswers: ['Ans2'],
				explanation: 'Secret 2'
			}
		];

		const clientQuestions = toClientQuestions(questions);

		expect(clientQuestions.length).toBe(2);
		expect(clientQuestions[0].id).toBe('q1');
		expect(clientQuestions[1].id).toBe('q2');
		expect(JSON.stringify(clientQuestions)).not.toContain('Secret');
	});
});
