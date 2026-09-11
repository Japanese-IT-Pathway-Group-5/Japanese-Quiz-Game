import { normalizeTypedAnswer } from './normalizeTypedAnswer';
import type { GradingResult, StoredQuestion, StoredChoice } from './types';

export type StoredQuestionForGrading = StoredQuestion & {
	choices?: readonly StoredChoice[];
};

/**
 * Grades a player's submitted answer against a stored question.
 *
 * Supports:
 * - multiple_choice & gap_fill: checks choice id matches a correct choice belonging to this question.
 * - typing: normalizes kana/romaji and checks against acceptedAnswers.
 * - word_ordering: checks submitted word array matches stored choice order.
 */
export function gradeAnswer(
	question: StoredQuestionForGrading,
	answer: string | readonly string[] | null | undefined
): GradingResult {
	const explanation = question.explanation ?? null;

	if (answer === null || answer === undefined || answer === '') {
		return { isCorrect: false, explanation };
	}

	switch (question.format) {
		case 'multiple_choice':
		case 'gap_fill': {
			if (typeof answer !== 'string') {
				return { isCorrect: false, explanation };
			}

			const choices = question.choices ?? [];
			const selected = choices.find((c) => c.id === answer);

			if (!selected) {
				// Option belongs to another question or does not exist
				return { isCorrect: false, explanation };
			}

			const isCorrect = Boolean(selected.isCorrect);
			const correctChoice = choices.find((c) => Boolean(c.isCorrect));

			return {
				isCorrect,
				explanation,
				correctAnswer: correctChoice?.text ?? correctChoice?.id
			};
		}

		case 'typing': {
			if (typeof answer !== 'string') {
				return { isCorrect: false, explanation };
			}

			const normalizedInput = normalizeTypedAnswer(answer);
			let acceptedList: string[] = [];

			if (Array.isArray(question.acceptedAnswers)) {
				acceptedList = question.acceptedAnswers;
			} else if (typeof question.acceptedAnswers === 'string') {
				try {
					acceptedList = JSON.parse(question.acceptedAnswers);
				} catch {
					acceptedList = [question.acceptedAnswers];
				}
			}

			const isCorrect = acceptedList.some(
				(accepted) => normalizeTypedAnswer(accepted) === normalizedInput
			);

			return {
				isCorrect,
				explanation,
				correctAnswer: acceptedList[0]
			};
		}

		case 'word_ordering': {
			const choices = question.choices ?? [];
			const sortedChoices = [...choices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
			const correctWords = sortedChoices.map((c) => c.text);
			const correctIds = sortedChoices.map((c) => c.id);

			let submittedItems: readonly string[] = [];
			if (Array.isArray(answer)) {
				submittedItems = answer;
			} else if (typeof answer === 'string') {
				try {
					const parsed = JSON.parse(answer);
					if (Array.isArray(parsed)) {
						submittedItems = parsed;
					} else {
						submittedItems = [answer];
					}
				} catch {
					submittedItems = answer.split(',').map((s) => s.trim());
				}
			}

			if (submittedItems.length !== choices.length) {
				return { isCorrect: false, explanation, correctAnswer: correctWords.join(' ') };
			}

			const matchesWords = submittedItems.every((item, i) => item === correctWords[i]);
			const matchesIds = submittedItems.every((item, i) => item === correctIds[i]);
			const isCorrect = matchesWords || matchesIds;

			return {
				isCorrect,
				explanation,
				correctAnswer: correctWords.join(' ')
			};
		}

		default:
			return { isCorrect: false, explanation };
	}
}
