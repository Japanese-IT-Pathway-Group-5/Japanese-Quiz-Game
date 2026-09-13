import type { GradingResult, StoredChoice, StoredQuestion } from './types';

export type StoredQuestionWithChoices = StoredQuestion & {
	choices?: readonly StoredChoice[];
};

/**
 * Grades a multiple-choice or gap-fill question answer.
 * The browser is never trusted to make that decision.
 *
 * Rules:
 * - Selecting the correct option is marked correct.
 * - Selecting any other option is marked wrong.
 * - An answer that names an option belonging to a different question is rejected rather than accepted.
 * - A missing or empty answer is marked wrong without throwing an error.
 */
export function gradeMultipleChoiceAnswer(
	question: StoredQuestionWithChoices,
	choiceId: string | null | undefined
): GradingResult {
	const explanation = question.explanation ?? null;

	if (!choiceId || typeof choiceId !== 'string' || choiceId.trim() === '') {
		return { isCorrect: false, explanation };
	}

	const choices = question.choices ?? [];
	const selectedChoice = choices.find((c) => c.id === choiceId);

	if (!selectedChoice) {
		// Option belongs to another question or does not exist
		return { isCorrect: false, explanation };
	}

	const isCorrect = Boolean(selectedChoice.isCorrect);
	const correctChoice = choices.find((c) => Boolean(c.isCorrect));

	return {
		isCorrect,
		explanation,
		correctAnswer: correctChoice?.text ?? correctChoice?.id
	};
}
