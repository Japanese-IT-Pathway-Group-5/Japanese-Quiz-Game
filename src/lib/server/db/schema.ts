import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const players = sqliteTable('players', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	nickname: text('nickname').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const questions = sqliteTable('questions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	level: text('level', { enum: ['N3', 'N4'] }).notNull(),
	category: text('category').notNull(),
	format: text('format', {
		enum: ['multiple_choice', 'gap_fill', 'word_ordering', 'typing']
	}).notNull(),
	prompt: text('prompt').notNull(),
	promptJa: text('prompt_ja'),
	acceptedAnswers: text('accepted_answers', { mode: 'json' }).$type<string[]>(),
	explanation: text('explanation'),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const choices = sqliteTable('choices', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	questionId: text('question_id')
		.notNull()
		.references(() => questions.id, { onDelete: 'cascade' }),
	text: text('text').notNull(),
	isCorrect: integer('is_correct', { mode: 'boolean' }).notNull().default(false),
	order: integer('order').notNull().default(0)
});

export const quizAttempts = sqliteTable('quiz_attempts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	playerId: text('player_id')
		.notNull()
		.references(() => players.id, { onDelete: 'cascade' }),
	nickname: text('nickname').notNull(),
	level: text('level', { enum: ['N3', 'N4'] }).notNull(),
	chosenQuestions: text('chosen_questions', { mode: 'json' }).$type<string[]>().notNull(),
	currentQuestionIndex: integer('current_question_index').notNull().default(0),
	correctCount: integer('correct_count').notNull().default(0),
	finalScore: integer('final_score'),
	startedAt: integer('started_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	finishedAt: integer('finished_at', { mode: 'timestamp' }),
	status: text('status', { enum: ['active', 'finished', 'abandoned'] })
		.notNull()
		.default('active')
});

export const attemptAnswers = sqliteTable('attempt_answers', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	attemptId: text('attempt_id')
		.notNull()
		.references(() => quizAttempts.id, { onDelete: 'cascade' }),
	questionId: text('question_id')
		.notNull()
		.references(() => questions.id, { onDelete: 'cascade' }),
	answer: text('answer').notNull(),
	isCorrect: integer('is_correct', { mode: 'boolean' }).notNull(),
	durationSeconds: integer('duration_seconds').notNull(),
	answeredAt: integer('answered_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Choice = typeof choices.$inferSelect;
export type NewChoice = typeof choices.$inferInsert;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type NewQuizAttempt = typeof quizAttempts.$inferInsert;
export type AttemptAnswer = typeof attemptAnswers.$inferSelect;
export type NewAttemptAnswer = typeof attemptAnswers.$inferInsert;
