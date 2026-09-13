import type {
	ClientChoice,
	ClientQuestion,
	QuestionLevel,
	StoredChoice,
	StoredQuestion
} from './types';

/**
 * Fisher-Yates array shuffle using an optional random function.
 */
export function shuffleArray<T>(items: readonly T[], randomFn: () => number = Math.random): T[] {
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(randomFn() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/**
 * Shuffles choices for word-ordering questions, ensuring they are not returned
 * in the original correct order (when choices length > 1).
 */
function shuffleWordOrderingChoices(
	choices: readonly StoredChoice[],
	shuffleFn?: (items: readonly StoredChoice[]) => readonly StoredChoice[]
): readonly StoredChoice[] {
	if (choices.length <= 1) {
		return [...choices];
	}

	if (shuffleFn) {
		return shuffleFn(choices);
	}

	const ordered = [...choices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	let shuffled = shuffleArray(ordered);

	const isSameOrder = shuffled.every((c, idx) => c.id === ordered[idx].id);
	if (isSameOrder) {
		shuffled = [...shuffled.slice(1), shuffled[0]];
	}

	return shuffled;
}

/**
 * Converts a stored question from the database into a client-safe browser question.
 *
 * Strips all sensitive data:
 * - `isCorrect` on choices
 * - `order` on choices
 * - `acceptedAnswers` on questions
 * - `explanation` on questions
 * - internal DB metadata (isActive, createdAt)
 *
 * For word_ordering questions, choices are guaranteed to be returned shuffled.
 */
export function toClientQuestion(
	question: StoredQuestion,
	shuffleFn?: (choices: readonly StoredChoice[]) => readonly StoredChoice[]
): ClientQuestion {
	const clientQuestion: ClientQuestion = {
		id: question.id,
		format: question.format,
		prompt: question.prompt
	};

	if (question.level) {
		clientQuestion.level = question.level as QuestionLevel;
	}

	if (question.category) {
		clientQuestion.category = question.category;
	}

	if (question.promptJa !== undefined) {
		clientQuestion.promptJa = question.promptJa;
	}

	if (question.choices && question.choices.length > 0) {
		let rawChoices = question.choices;

		if (question.format === 'word_ordering') {
			rawChoices = shuffleWordOrderingChoices(rawChoices, shuffleFn);
		}

		clientQuestion.choices = rawChoices.map((choice): ClientChoice => ({
			id: choice.id,
			text: choice.text
		}));
	}

	return clientQuestion;
}

/**
 * Batch converts a list of stored questions into client-safe questions.
 */
export function toClientQuestions(
	questions: StoredQuestion[],
	shuffleFn?: (choices: readonly StoredChoice[]) => readonly StoredChoice[]
): ClientQuestion[] {
	return questions.map((q) => toClientQuestion(q, shuffleFn));
}
