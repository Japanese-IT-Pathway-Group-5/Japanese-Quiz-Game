import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { players } from '$lib/server/db/schema';
import { startQuizAttempt } from '$lib/server/quiz';

const MAX_NICKNAME_LENGTH = 30;

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.playerId || !platform?.env?.DB) {
		return { nickname: '', player: null };
	}

	const db = getDb(platform.env.DB);
	const [player] = await db.select().from(players).where(eq(players.id, locals.playerId));

	return {
		nickname: player?.nickname ?? '',
		player: player ?? null
	};
};

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
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

		if (!platform?.env?.DB) {
			return fail(500, {
				nickname,
				level,
				error:
					'Database binding (DB) is unavailable. Run `npm run preview` to run with Cloudflare D1 local database.'
			});
		}

		const db = getDb(platform.env.DB);

		let attempt;
		try {
			attempt = await startQuizAttempt(db, {
				playerId: locals.playerId,
				nickname,
				level
			});
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : 'Failed to start quiz.';
			return fail(400, {
				nickname,
				level,
				error: message
			});
		}

		throw redirect(303, `/play/${attempt.id}`);
	}
};
