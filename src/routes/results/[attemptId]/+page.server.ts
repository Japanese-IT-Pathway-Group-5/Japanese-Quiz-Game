import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { quizAttempts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals, platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	const db = getDb(platform!.env.DB);
	const [attempt] = await db
		.select()
		.from(quizAttempts)
		.where(eq(quizAttempts.id, params.attemptId));

	if (!attempt) {
		throw error(404, 'Game not found.');
	}

	if (attempt.playerId !== locals.playerId) {
		throw error(403, 'This game does not belong to this player.');
	}

	if (attempt.status !== 'finished') {
		throw redirect(303, `/play/${attempt.id}`);
	}

	return {
		attempt
	};
};
