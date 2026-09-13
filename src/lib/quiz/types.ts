export type QuestionFormat = 'multiple_choice' | 'gap_fill' | 'word_ordering' | 'typing';

export type QuestionLevel = 'N3' | 'N4';

/**
 * An answer choice as seen by the browser.
 * Contains only public presentation data — never `isCorrect` or `order`.
 */
export type ClientChoice = {
	id: string;
	text: string;
};

/**
 * A question as delivered to the browser.
 * Stripped of all answer keys, accepted answers, and explanations.
 */
export type ClientQuestion = {
	id: string;
	level?: QuestionLevel;
	category?: string;
	format: QuestionFormat;
	prompt: string;
	promptJa?: string | null;
	choices?: readonly ClientChoice[];
};

/**
 * A choice stored in the database.
 */
export type StoredChoice = {
	id: string;
	questionId?: string;
	text: string;
	isCorrect?: boolean | number;
	order?: number;
};

/**
 * A question stored in the database, containing sensitive answer data.
 */
export type StoredQuestion = {
	id: string;
	level?: QuestionLevel | string;
	category?: string;
	format: QuestionFormat;
	prompt: string;
	promptJa?: string | null;
	acceptedAnswers?: string[] | string | null;
	explanation?: string | null;
	isActive?: boolean | number;
	createdAt?: Date | number;
	choices?: readonly StoredChoice[];
};

/**
 * The outcome of grading a submitted answer on the server.
 */
export type GradingResult = {
	isCorrect: boolean;
	explanation?: string | null;
	correctAnswer?: string | string[];
};
