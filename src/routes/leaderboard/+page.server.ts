import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { quizAttempts } from '$lib/server/db/schema';

type LevelFilter = 'all' | 'N3' | 'N4';

type LeaderboardEntry = {
	attemptId: string;
	playerId: string;
	nickname: string;
	level: 'N3' | 'N4';
	score: number;
	timeSeconds: number;
	finishedAt: Date;
};

export const load: PageServerLoad = async ({ url, platform, locals }) => {
	const requestedLevel = url.searchParams.get('level');

	const level: LevelFilter =
		requestedLevel === 'N3' || requestedLevel === 'N4' ? requestedLevel : 'all';

	const db = getDb(platform!.env.DB);

	const conditions = [eq(quizAttempts.status, 'finished')];

	if (level !== 'all') {
		conditions.push(eq(quizAttempts.level, level));
	}

	const attempts = await db
		.select({
			attemptId: quizAttempts.id,
			playerId: quizAttempts.playerId,
			nickname: quizAttempts.nickname,
			level: quizAttempts.level,
			finalScore: quizAttempts.finalScore,
			startedAt: quizAttempts.startedAt,
			finishedAt: quizAttempts.finishedAt
		})
		.from(quizAttempts)
		.where(and(...conditions));

	const leaderboard = attempts
		.flatMap((attempt): LeaderboardEntry[] => {
			if (attempt.finalScore === null || attempt.finishedAt === null) return [];

			return [
				{
					attemptId: attempt.attemptId,
					playerId: attempt.playerId,
					nickname: attempt.nickname,
					level: attempt.level,
					score: attempt.finalScore,
					timeSeconds: Math.max(
						0,
						Math.floor((attempt.finishedAt.getTime() - attempt.startedAt.getTime()) / 1000)
					),
					finishedAt: attempt.finishedAt
				}
			];
		})
		.sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds)
		.slice(0, 100)
		.map((entry, index) => ({
			position: index + 1,
			...entry,
			isCurrentPlayer: entry.playerId === locals.playerId
		}));

	return {
		level,
		leaderboard
	};
};
