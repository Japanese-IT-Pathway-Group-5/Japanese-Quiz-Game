import { normalizeTypedAnswer } from './normalizeTypedAnswer';
import type { GradingResult, StoredQuestion } from './types';

export function gradeTypedAnswer(playerInput: string, question: StoredQuestion): GradingResult {
	const accepted = normalizeAcceptedAnswers(question.acceptedAnswers);
	const normalizedInput = normalizeTypedAnswer(playerInput);

	const isCorrect = normalizedInput !== '' && accepted.includes(normalizedInput);

	return {
		isCorrect,
		explanation: question.explanation,
		correctAnswer: question.acceptedAnswers ?? undefined
	};
}

function normalizeAcceptedAnswers(acceptedAnswers: StoredQuestion['acceptedAnswers']): string[] {
	if (!acceptedAnswers) {
		return [];
	}
	return Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers];
}
