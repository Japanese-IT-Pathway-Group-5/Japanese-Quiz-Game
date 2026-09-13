/**
 * Calculates a final quiz score from 0 to 100 based on accuracy and speed.
 * Accuracy is prioritized (80% weight), with a capped speed bonus (20% weight).
 */
export function calculateScore(correct: number, total: number, timeTaken: number): number {
	if (total <= 0 || correct <= 0) {
		return 0;
	}

	const accuracy = correct / total;
	const targetTime = 60;
	const speedBonus = timeTaken <= 0 ? 1 : Math.min(1, targetTime / timeTaken);
	const score = accuracy * 80 + speedBonus * 20;

	return Math.round(score);
}
