import { describe, expect, it } from 'vitest';
import { gradeAnswer } from './gradeAnswer';
import type { StoredQuestionForGrading } from './gradeAnswer';

describe('gradeAnswer', () => {
	describe('multiple_choice and gap_fill', () => {
		const question: StoredQuestionForGrading = {
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

		it('marks the correct option as correct', () => {
			const result = gradeAnswer(question, 'c1');
			expect(result.isCorrect).toBe(true);
			expect(result.explanation).toBe('It means to guide or show around.');
		});

		it('marks any other option as wrong', () => {
			const result = gradeAnswer(question, 'c2');
			expect(result.isCorrect).toBe(false);
			expect(result.explanation).toBe('It means to guide or show around.');
		});

		it('rejects an option belonging to a different question', () => {
			const result = gradeAnswer(question, 'c_other_question_option');
			expect(result.isCorrect).toBe(false);
		});

		it('marks empty or missing answer as wrong without error', () => {
			expect(gradeAnswer(question, '').isCorrect).toBe(false);
			expect(gradeAnswer(question, null).isCorrect).toBe(false);
			expect(gradeAnswer(question, undefined).isCorrect).toBe(false);
		});

		it('grades gap_fill questions identically', () => {
			const gapFill: StoredQuestionForGrading = {
				...question,
				format: 'gap_fill',
				prompt: '日曜日 [ ___ ] 友達と映画を見に行きます。',
				choices: [
					{ id: 'c_gf_1', questionId: 'q_gf', text: 'に', isCorrect: true, order: 0 },
					{ id: 'c_gf_2', questionId: 'q_gf', text: 'で', isCorrect: false, order: 1 }
				]
			};

			expect(gradeAnswer(gapFill, 'c_gf_1').isCorrect).toBe(true);
			expect(gradeAnswer(gapFill, 'c_gf_2').isCorrect).toBe(false);
		});
	});

	describe('typing', () => {
		const question: StoredQuestionForGrading = {
			id: 'q_ty_01',
			format: 'typing',
			prompt: 'Type reading for 週末',
			acceptedAnswers: ['しゅうまつ', 'shuumatsu', 'syuumatsu'],
			explanation: 'Read as しゅうまつ'
		};

		it('marks accepted answers correct, including romaji normalization', () => {
			expect(gradeAnswer(question, 'しゅうまつ').isCorrect).toBe(true);
			expect(gradeAnswer(question, 'shuumatsu').isCorrect).toBe(true);
			expect(gradeAnswer(question, 'syuumatsu').isCorrect).toBe(true);
		});

		it('marks wrong answers incorrect', () => {
			expect(gradeAnswer(question, 'しゅうまつう').isCorrect).toBe(false);
			expect(gradeAnswer(question, 'week').isCorrect).toBe(false);
		});
	});

	describe('word_ordering', () => {
		const question: StoredQuestionForGrading = {
			id: 'q_wo_01',
			format: 'word_ordering',
			prompt: 'Arrange words',
			choices: [
				{ id: 'c1', text: '私は', order: 0 },
				{ id: 'c2', text: '日本語を', order: 1 },
				{ id: 'c3', text: '勉強します', order: 2 }
			]
		};

		it('marks correct word sequence as correct', () => {
			const result = gradeAnswer(question, ['私は', '日本語を', '勉強します']);
			expect(result.isCorrect).toBe(true);
		});

		it('marks correct ID sequence as correct', () => {
			const result = gradeAnswer(question, ['c1', 'c2', 'c3']);
			expect(result.isCorrect).toBe(true);
		});

		it('marks wrong word sequence as incorrect', () => {
			const result = gradeAnswer(question, ['日本語を', '私は', '勉強します']);
			expect(result.isCorrect).toBe(false);
		});

		it('marks incomplete sequence as incorrect', () => {
			const result = gradeAnswer(question, ['私は', '日本語を']);
			expect(result.isCorrect).toBe(false);
		});
	});
});
