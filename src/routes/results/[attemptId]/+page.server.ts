import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { quizAttempts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { calculateScore } from '$lib/quiz/calculateScore';

export const load: PageServerLoad = async ({ params, locals, platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	if (!locals.playerId) {
		throw error(403, 'This game does not belong to this player.');
	}

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

	if (attempt.finalScore === null) {
		const totalQuestions = (attempt.chosenQuestions ?? []).length;
		const timeTaken =
			attempt.finishedAt && attempt.startedAt
				? Math.max(
						0,
						Math.round((attempt.finishedAt.getTime() - attempt.startedAt.getTime()) / 1000)
					)
				: 0;

		const finalScore = calculateScore(attempt.correctCount, totalQuestions, timeTaken);

		await db.update(quizAttempts).set({ finalScore }).where(eq(quizAttempts.id, attempt.id));

		attempt.finalScore = finalScore;
	}

	return {
		attempt
	};
};
