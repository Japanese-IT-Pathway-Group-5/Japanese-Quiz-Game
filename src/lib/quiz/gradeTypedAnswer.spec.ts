import { describe, it, expect } from 'vitest';
import { gradeTypedAnswer } from './gradeTypedAnswer';
import type { StoredQuestion } from './types';

function makeQuestion(overrides: Partial<StoredQuestion> = {}): StoredQuestion {
	return {
		id: 'q1',
		format: 'typing',
		prompt: 'transparent',
		acceptedAnswers: ['とうめい'],
		...overrides
	};
}

describe('gradeTypedAnswer', () => {
	it('accepts romaji input matching a kana accepted answer', () => {
		expect(gradeTypedAnswer('toumei', makeQuestion()).isCorrect).toBe(true);
	});

	it('accepts kana input matching directly', () => {
		expect(gradeTypedAnswer('とうめい', makeQuestion()).isCorrect).toBe(true);
	});

	it('accepts any one of multiple accepted answers', () => {
		const question = makeQuestion({ acceptedAnswers: ['ねこ', 'ねっこ'] });
		expect(gradeTypedAnswer('neko', question).isCorrect).toBe(true);
		expect(gradeTypedAnswer('nekko', question).isCorrect).toBe(true);
	});

	it('handles a single string accepted answer, not just arrays', () => {
		const question = makeQuestion({ acceptedAnswers: 'ねこ' });
		expect(gradeTypedAnswer('neko', question).isCorrect).toBe(true);
	});

	it('rejects input not matching any accepted answer', () => {
		expect(gradeTypedAnswer('inu', makeQuestion()).isCorrect).toBe(false);
	});

	it('ignores extra surrounding whitespace', () => {
		expect(gradeTypedAnswer('  toumei  ', makeQuestion()).isCorrect).toBe(true);
	});

	it('marks empty input as wrong without throwing', () => {
		expect(() => gradeTypedAnswer('', makeQuestion())).not.toThrow();
		expect(gradeTypedAnswer('', makeQuestion()).isCorrect).toBe(false);
	});

	it('marks whitespace-only input as wrong', () => {
		expect(gradeTypedAnswer('   ', makeQuestion()).isCorrect).toBe(false);
	});

	it('handles a question with no accepted answers without throwing', () => {
		const question = makeQuestion({ acceptedAnswers: null });
		expect(() => gradeTypedAnswer('toumei', question)).not.toThrow();
		expect(gradeTypedAnswer('toumei', question).isCorrect).toBe(false);
	});
});
