import type { GradingResult, StoredChoice, StoredQuestion } from './types';

export type StoredQuestionWithWordChoices = StoredQuestion & {
	choices?: readonly StoredChoice[];
};

/**
 * Grades a word ordering question answer against a stored question.
 *
 * Rules:
 * - A sequence matching the stored order is marked correct.
 * - A sequence with the right words in the wrong order is marked wrong.
 * - A sequence missing a word, or containing a word that is not part of the question, is marked wrong.
 * - Supports word strings, choice IDs, or serialized representations.
 */
export function gradeWordOrderingAnswer(
	question: StoredQuestionWithWordChoices,
	submittedAnswer: string | readonly string[] | null | undefined
): GradingResult {
	const explanation = question.explanation ?? null;
	const choices = question.choices ?? [];
	const sortedChoices = [...choices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	const correctWords = sortedChoices.map((c) => c.text);
	const correctIds = sortedChoices.map((c) => c.id);
	const correctAnswer = correctWords.join(' ');

	if (!submittedAnswer || choices.length === 0) {
		return { isCorrect: false, explanation, correctAnswer };
	}

	let submittedItems: readonly string[] = [];
	if (Array.isArray(submittedAnswer)) {
		submittedItems = submittedAnswer;
	} else if (typeof submittedAnswer === 'string') {
		const trimmed = submittedAnswer.trim();
		if (trimmed === '') {
			return { isCorrect: false, explanation, correctAnswer };
		}
		try {
			const parsed = JSON.parse(trimmed);
			if (Array.isArray(parsed)) {
				submittedItems = parsed;
			} else {
				submittedItems = [trimmed];
			}
		} catch {
			submittedItems = trimmed.split(',').map((s) => s.trim());
		}
	}

	// Must match the exact number of words
	if (submittedItems.length !== choices.length) {
		return { isCorrect: false, explanation, correctAnswer };
	}

	const matchesWords = submittedItems.every((item, i) => item === correctWords[i]);
	const matchesIds = submittedItems.every((item, i) => item === correctIds[i]);
	const isCorrect = matchesWords || matchesIds;

	return {
		isCorrect,
		explanation,
		correctAnswer
	};
}
