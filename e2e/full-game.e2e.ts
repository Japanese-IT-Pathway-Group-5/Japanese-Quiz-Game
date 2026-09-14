import { test, expect } from '@playwright/test';
import { startNewGame, playFullGame } from './support/helpers';

test('a full game can be played end to end and the results screen shows a score', async ({
	page
}) => {
	const nickname = `E2E-${Date.now()}`;

	await startNewGame(page, { nickname, level: 'N4' });

	const { totalAnswered } = await playFullGame(page);

	await expect(page).toHaveURL(/\/results\//);

	// Results page renders a stat card whose label is "Correct" and whose
	// value is "{correctCount} / {totalQuestions}" - see
	// src/routes/results/[attemptId]/+page.svelte. We can't legitimately know
	// correctCount ourselves (the app never sends it to the client mid-game),
	// so just assert the format is well-formed and the denominator matches.
	const correctStat = page.locator('.stat-item', { hasText: 'Correct' }).locator('.stat-value');
	await expect(correctStat).toContainText(`/ ${totalAnswered}`);
	await expect(correctStat).toHaveText(/^\d+\s*\/\s*\d+$/);
});
