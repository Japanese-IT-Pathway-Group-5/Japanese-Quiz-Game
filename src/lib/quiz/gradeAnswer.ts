import { gradeMultipleChoiceAnswer } from './gradeMultipleChoiceAnswer';
import { gradeTypedAnswer } from './gradeTypedAnswer';
import { gradeWordOrderingAnswer } from './gradeWordOrderingAnswer';
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
			return gradeMultipleChoiceAnswer(question, answer);
		}

		case 'typing': {
			if (typeof answer !== 'string') {
				return { isCorrect: false, explanation };
			}
			return gradeTypedAnswer(answer, question);
		}

		case 'word_ordering': {
			return gradeWordOrderingAnswer(question, answer);
		}

		default:
			return { isCorrect: false, explanation };
	}
}
