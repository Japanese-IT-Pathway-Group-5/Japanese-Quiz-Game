import { describe, expect, it } from 'vitest';
import { gradeMultipleChoiceAnswer } from './gradeMultipleChoiceAnswer';
import type { StoredQuestionWithChoices } from './gradeMultipleChoiceAnswer';

describe('gradeMultipleChoiceAnswer', () => {
	const question: StoredQuestionWithChoices = {
		id: 'q_mc_01',
		level: 'N4',
		category: 'vocabulary',
		format: 'multiple_choice',
		prompt: 'What is the meaning of 「案内する」?',
		explanation: 'It means to guide or show around.',
		choices: [
			{
				id: 'c1',
				questionId: 'q_mc_01',
				text: 'To guide / show around',
				isCorrect: true,
				order: 0
			},
			{ id: 'c2', questionId: 'q_mc_01', text: 'To invite', isCorrect: false, order: 1 },
			{ id: 'c3', questionId: 'q_mc_01', text: 'To prepare', isCorrect: false, order: 2 }
		]
	};

	it('marks selecting the correct option as correct', () => {
		const result = gradeMultipleChoiceAnswer(question, 'c1');
		expect(result.isCorrect).toBe(true);
		expect(result.explanation).toBe('It means to guide or show around.');
		expect(result.correctAnswer).toBe('To guide / show around');
	});

	it('marks selecting any other option as wrong', () => {
		const result = gradeMultipleChoiceAnswer(question, 'c2');
		expect(result.isCorrect).toBe(false);
		expect(result.explanation).toBe('It means to guide or show around.');
	});

	it('rejects an answer that names an option belonging to a different question', () => {
		const result = gradeMultipleChoiceAnswer(question, 'c_other_question_option');
		expect(result.isCorrect).toBe(false);
	});

	it('marks a missing or empty answer as wrong without causing an error', () => {
		expect(gradeMultipleChoiceAnswer(question, '').isCorrect).toBe(false);
		expect(gradeMultipleChoiceAnswer(question, '   ').isCorrect).toBe(false);
		expect(gradeMultipleChoiceAnswer(question, null).isCorrect).toBe(false);
		expect(gradeMultipleChoiceAnswer(question, undefined).isCorrect).toBe(false);
	});

	it('grades gap_fill questions correctly with the same logic', () => {
		const gapFill: StoredQuestionWithChoices = {
			id: 'q_gf_01',
			level: 'N4',
			category: 'grammar',
			format: 'gap_fill',
			prompt: '日曜日 [ ___ ] 友達と映画を見に行きます。',
			explanation: 'に is used for specific time/day.',
			choices: [
				{ id: 'c_gf_1', questionId: 'q_gf_01', text: 'に', isCorrect: true, order: 0 },
				{ id: 'c_gf_2', questionId: 'q_gf_01', text: 'で', isCorrect: false, order: 1 }
			]
		};

		expect(gradeMultipleChoiceAnswer(gapFill, 'c_gf_1').isCorrect).toBe(true);
		expect(gradeMultipleChoiceAnswer(gapFill, 'c_gf_2').isCorrect).toBe(false);
		expect(gradeMultipleChoiceAnswer(gapFill, 'c_unknown').isCorrect).toBe(false);
	});

	it('handles question without choices safely', () => {
		const noChoices: StoredQuestionWithChoices = {
			id: 'q_no_choices',
			format: 'multiple_choice',
			prompt: 'Empty choices question'
		};

		expect(gradeMultipleChoiceAnswer(noChoices, 'c1').isCorrect).toBe(false);
	});
});
