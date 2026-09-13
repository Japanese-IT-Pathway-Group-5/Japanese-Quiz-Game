import { and, eq } from 'drizzle-orm';
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
			playerId: quizAttempts.playerId,
			nickname: quizAttempts.nickname,
			level: quizAttempts.level,
			finalScore: quizAttempts.finalScore,
			startedAt: quizAttempts.startedAt,
			finishedAt: quizAttempts.finishedAt
		})
		.from(quizAttempts)
		.where(and(...conditions));

	/*
	 * Keep only the best attempt for each player.
	 *
	 * Best attempt rules:
	 * 1. Higher score wins.
	 * 2. If scores are equal, faster completion time wins.
	 */
	const bestByPlayer = new Map<string, LeaderboardEntry>();

	for (const attempt of attempts) {
		if (attempt.finalScore === null || attempt.startedAt === null || attempt.finishedAt === null) {
			continue;
		}

		const timeSeconds = Math.max(
			0,
			Math.floor((attempt.finishedAt.getTime() - attempt.startedAt.getTime()) / 1000)
		);

		const candidate: LeaderboardEntry = {
			playerId: attempt.playerId,
			nickname: attempt.nickname,
			level: attempt.level,
			score: attempt.finalScore,
			timeSeconds
		};

		const existing = bestByPlayer.get(attempt.playerId);

		if (
			!existing ||
			candidate.score > existing.score ||
			(candidate.score === existing.score && candidate.timeSeconds < existing.timeSeconds)
		) {
			bestByPlayer.set(attempt.playerId, candidate);
		}
	}

	const leaderboard = Array.from(bestByPlayer.values())
		.sort((a, b) => {
			if (b.score !== a.score) {
				return b.score - a.score;
			}

			return a.timeSeconds - b.timeSeconds;
		})
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
