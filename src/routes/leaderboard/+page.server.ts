import { and, desc, eq, isNotNull, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { quizAttempts } from '$lib/server/db/schema';

type LevelFilter = 'all' | 'N3' | 'N4';

type LeaderboardEntry = {
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

	const conditions = [
		eq(quizAttempts.status, 'finished'),
		isNotNull(quizAttempts.finalScore),
		isNotNull(quizAttempts.finishedAt)
	];

	if (level !== 'all') {
		conditions.push(eq(quizAttempts.level, level));
	}

	const completionTimeMs = sql<number>`(${quizAttempts.finishedAt} - ${quizAttempts.startedAt})`;
	const rankedAttempts = db.$with('ranked_attempts').as(
		db
			.select({
				playerId: quizAttempts.playerId,
				nickname: quizAttempts.nickname,
				level: quizAttempts.level,
				finalScore: quizAttempts.finalScore,
				finishedAt: quizAttempts.finishedAt,
				completionTimeMs,
				rank: sql<number>`row_number() over (
				partition by ${quizAttempts.playerId}
				order by ${quizAttempts.finalScore} desc, ${completionTimeMs} asc, ${quizAttempts.finishedAt} desc
			)`.as('rank')
			})
			.from(quizAttempts)
			.where(and(...conditions))
	);

	const entries = await db
		.with(rankedAttempts)
		.select()
		.from(rankedAttempts)
		.where(eq(rankedAttempts.rank, 1))
		.orderBy(desc(rankedAttempts.finalScore), rankedAttempts.completionTimeMs)
		.limit(100);

	const leaderboard = entries.map((entry, index) => {
		const leaderboardEntry: LeaderboardEntry = {
			playerId: entry.playerId,
			nickname: entry.nickname,
			level: entry.level as 'N3' | 'N4',
			score: entry.finalScore ?? 0,
			timeSeconds: Math.max(0, Math.floor((entry.completionTimeMs ?? 0) / 1000)),
			finishedAt: entry.finishedAt ?? new Date(0)
		};

		return {
			position: index + 1,
			...leaderboardEntry,
			isCurrentPlayer: leaderboardEntry.playerId === locals.playerId
		};
	});

	return {
		level,
		leaderboard
	};
};
