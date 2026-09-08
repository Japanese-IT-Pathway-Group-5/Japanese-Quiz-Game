import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const quizQuestion = sqliteTable('quiz_question', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	level: text('level').notNull(),

	category: text('category').notNull(),

	format: text('format').notNull(),

	prompt: text('prompt').notNull(),

	active: integer('active', { mode: 'boolean' }).notNull().default(true),

	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),

	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const quizAnswer = sqliteTable('quiz_answer', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	questionId: text('question_id')
		.notNull()
		.references(() => quizQuestion.id, { onDelete: 'cascade' }),

	answer: text('answer').notNull(),

	isCorrect: integer('is_correct', { mode: 'boolean' }).notNull().default(false),

	position: integer('position')
});
