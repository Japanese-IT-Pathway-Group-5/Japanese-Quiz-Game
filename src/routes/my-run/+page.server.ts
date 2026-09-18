import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { players, quizAttempts } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export type UserStats = {
	totalRuns: number;
	bestScore: number;
	bestScoreN4: number | null;
	bestScoreN3: number | null;
	averageScore: number;
	totalCorrectAnswers: number;
	totalQuestionsAnswered: number;
	overallAccuracy: number;
	totalTimeSeconds: number;
	n4RunsCount: number;
	n3RunsCount: number;
	n4Accuracy: number | null;
	n3Accuracy: number | null;
};

export type PreviousRun = {
	attemptId: string;
	level: 'N3' | 'N4';
	score: number;
	correctCount: number;
	totalQuestions: number;
	accuracy: number;
	timeSeconds: number;
	finishedAt: Date;
};

export const load: PageServerLoad = async ({ locals, platform, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store'
	});

	if (!locals.playerId || !platform?.env?.DB) {
		return {
			isAuthenticated: false,
			player: null,
			stats: null,
			runs: []
		};
	}

	const db = getDb(platform.env.DB);
	const [player] = await db.select().from(players).where(eq(players.id, locals.playerId));

	const isAuthenticated = Boolean(player?.googleId && !player?.isAnonymous);

	// Fetch all finished quiz attempts for this player
	const finishedAttempts = await db
		.select()
		.from(quizAttempts)
		.where(and(eq(quizAttempts.playerId, locals.playerId), eq(quizAttempts.status, 'finished')))
		.orderBy(desc(quizAttempts.finishedAt));

	const runs: PreviousRun[] = finishedAttempts.map((attempt) => {
		const totalQuestions = attempt.chosenQuestions.length;
		const accuracy =
			totalQuestions > 0 ? Math.round((attempt.correctCount / totalQuestions) * 100) : 0;
		const timeSeconds =
			attempt.finishedAt && attempt.startedAt
				? Math.max(
						0,
						Math.floor((attempt.finishedAt.getTime() - attempt.startedAt.getTime()) / 1000)
					)
				: 0;

		return {
			attemptId: attempt.id,
			level: attempt.level,
			score: attempt.finalScore ?? 0,
			correctCount: attempt.correctCount,
			totalQuestions,
			accuracy,
			timeSeconds,
			finishedAt: attempt.finishedAt ? new Date(attempt.finishedAt) : new Date()
		};
	});

	let stats: UserStats | null = null;

	if (runs.length > 0) {
		const totalRuns = runs.length;
		const bestScore = Math.max(...runs.map((r) => r.score));

		const n4Runs = runs.filter((r) => r.level === 'N4');
		const n3Runs = runs.filter((r) => r.level === 'N3');

		const bestScoreN4 = n4Runs.length > 0 ? Math.max(...n4Runs.map((r) => r.score)) : null;
		const bestScoreN3 = n3Runs.length > 0 ? Math.max(...n3Runs.map((r) => r.score)) : null;

		const totalScoreSum = runs.reduce((sum, r) => sum + r.score, 0);
		const averageScore = Math.round(totalScoreSum / totalRuns);

		const totalCorrectAnswers = runs.reduce((sum, r) => sum + r.correctCount, 0);
		const totalQuestionsAnswered = runs.reduce((sum, r) => sum + r.totalQuestions, 0);
		const overallAccuracy =
			totalQuestionsAnswered > 0
				? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
				: 0;

		const n4Correct = n4Runs.reduce((sum, r) => sum + r.correctCount, 0);
		const n4Total = n4Runs.reduce((sum, r) => sum + r.totalQuestions, 0);
		const n4Accuracy = n4Total > 0 ? Math.round((n4Correct / n4Total) * 100) : null;

		const n3Correct = n3Runs.reduce((sum, r) => sum + r.correctCount, 0);
		const n3Total = n3Runs.reduce((sum, r) => sum + r.totalQuestions, 0);
		const n3Accuracy = n3Total > 0 ? Math.round((n3Correct / n3Total) * 100) : null;

		const totalTimeSeconds = runs.reduce((sum, r) => sum + r.timeSeconds, 0);

		stats = {
			totalRuns,
			bestScore,
			bestScoreN4,
			bestScoreN3,
			averageScore,
			totalCorrectAnswers,
			totalQuestionsAnswered,
			overallAccuracy,
			totalTimeSeconds,
			n4RunsCount: n4Runs.length,
			n3RunsCount: n3Runs.length,
			n4Accuracy,
			n3Accuracy
		};
	}

	return {
		isAuthenticated,
		player: player ?? null,
		stats,
		runs
	};
};
