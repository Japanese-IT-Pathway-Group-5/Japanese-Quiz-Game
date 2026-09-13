import { describe, expect, it } from 'vitest';
import { gradeWordOrderingAnswer } from './gradeWordOrderingAnswer';
import type { StoredQuestionWithWordChoices } from './gradeWordOrderingAnswer';

describe('gradeWordOrderingAnswer', () => {
	const question: StoredQuestionWithWordChoices = {
		id: 'q_wo_01',
		level: 'N4',
		category: 'grammar',
		format: 'word_ordering',
		prompt: 'Arrange the words to say "I study Japanese"',
		explanation: 'Sentence order: 私は 日本語を 勉強します',
		choices: [
			{ id: 'c1', questionId: 'q_wo_01', text: '私は', isCorrect: false, order: 0 },
			{ id: 'c2', questionId: 'q_wo_01', text: '日本語を', isCorrect: false, order: 1 },
			{ id: 'c3', questionId: 'q_wo_01', text: '勉強します', isCorrect: false, order: 2 }
		]
	};

	it('marks a sequence matching the stored order as correct (using words)', () => {
		const result = gradeWordOrderingAnswer(question, ['私は', '日本語を', '勉強します']);
		expect(result.isCorrect).toBe(true);
		expect(result.explanation).toBe('Sentence order: 私は 日本語を 勉強します');
		expect(result.correctAnswer).toBe('私は 日本語を 勉強します');
	});

	it('marks a sequence matching the stored order as correct (using IDs)', () => {
		const result = gradeWordOrderingAnswer(question, ['c1', 'c2', 'c3']);
		expect(result.isCorrect).toBe(true);
		expect(result.correctAnswer).toBe('私は 日本語を 勉強します');
	});

	it('marks a sequence matching stored order from JSON string as correct', () => {
		const result = gradeWordOrderingAnswer(
			question,
			JSON.stringify(['私は', '日本語を', '勉強します'])
		);
		expect(result.isCorrect).toBe(true);
	});

	it('marks a sequence with the right words in the wrong order as wrong', () => {
		const result = gradeWordOrderingAnswer(question, ['日本語を', '私は', '勉強します']);
		expect(result.isCorrect).toBe(false);
		expect(result.explanation).toBe('Sentence order: 私は 日本語を 勉強します');
	});

	it('marks a sequence missing a word as wrong', () => {
		const result = gradeWordOrderingAnswer(question, ['私は', '日本語を']);
		expect(result.isCorrect).toBe(false);
	});

	it('marks a sequence containing a word that is not part of the question as wrong', () => {
		const result = gradeWordOrderingAnswer(question, ['私は', '英語を', '勉強します']);
		expect(result.isCorrect).toBe(false);
	});

	it('marks empty or null answer as wrong without error', () => {
		expect(gradeWordOrderingAnswer(question, null).isCorrect).toBe(false);
		expect(gradeWordOrderingAnswer(question, undefined).isCorrect).toBe(false);
		expect(gradeWordOrderingAnswer(question, '').isCorrect).toBe(false);
		expect(gradeWordOrderingAnswer(question, []).isCorrect).toBe(false);
	});

	it('handles question with no choices safely', () => {
		const emptyQuestion: StoredQuestionWithWordChoices = {
			id: 'q_empty',
			format: 'word_ordering',
			prompt: 'No choices'
		};
		expect(gradeWordOrderingAnswer(emptyQuestion, ['word']).isCorrect).toBe(false);
	});
});
