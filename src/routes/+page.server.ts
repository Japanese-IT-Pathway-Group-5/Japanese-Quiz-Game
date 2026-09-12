import { eq, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { players, questions, quizAttempts } from '$lib/server/db/schema';

const MAX_NICKNAME_LENGTH = 30;
const DEFAULT_QUESTION_COUNT = 10;

const chooseQuestions = (availableQuestionIds: string[]) => {
	const shuffled = [...availableQuestionIds];

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}

	return shuffled.slice(0, Math.min(DEFAULT_QUESTION_COUNT, shuffled.length));
};

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDb(platform!.env.DB);
	const [player] = await db.select().from(players).where(eq(players.id, locals.playerId));

	return {
		nickname: player?.nickname ?? ''
	};
};

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const db = getDb(platform!.env.DB);
		const formData = await request.formData();
		const rawNickname = formData.get('nickname');
		const rawLevel = formData.get('level');
		const nickname = typeof rawNickname === 'string' ? rawNickname.trim() : '';
		const level = rawLevel === 'N3' || rawLevel === 'N4' ? rawLevel : null;

		if (nickname.length === 0) {
			return fail(400, {
				nickname,
				level: level ?? 'N4',
				error: 'Nickname is required.'
			});
		}

		if (nickname.length > MAX_NICKNAME_LENGTH) {
			return fail(400, {
				nickname,
				level: level ?? 'N4',
				error: `Nickname must be ${MAX_NICKNAME_LENGTH} characters or fewer.`
			});
		}

		if (!level) {
			return fail(400, {
				nickname,
				level: 'N4',
				error: 'Please choose a level.'
			});
		}

		await db
			.insert(players)
			.values({
				id: locals.playerId,
				nickname
			})
			.onConflictDoUpdate({
				target: players.id,
				set: { nickname }
			});

		const activeQuestions = await db
			.select({ id: questions.id })
			.from(questions)
			.where(and(eq(questions.level, level), eq(questions.isActive, true)));

		if (activeQuestions.length === 0) {
			return fail(400, {
				nickname,
				level,
				error: `No active questions are available for ${level}.`
			});
		}

		const chosenQuestions = chooseQuestions(activeQuestions.map((question) => question.id));

		const [attempt] = await db
			.insert(quizAttempts)
			.values({
				id: crypto.randomUUID(),
				playerId: locals.playerId,
				nickname,
				level,
				chosenQuestions,
				currentQuestionIndex: 0,
				correctCount: 0,
				status: 'active'
			})
			.returning();

		throw redirect(303, `/play/${attempt.id}`);
	}
};
