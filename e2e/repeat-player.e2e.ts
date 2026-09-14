import { test, expect } from '@playwright/test';
import { startNewGame, playFullGame } from './support/helpers';

test('playing a second game as the same player keeps one leaderboard row with the best score', async ({
	page
}) => {
	// Same `page` (and therefore the same browser context and the same
	// httpOnly `player_id` cookie, see src/lib/server/auth/playerSession.ts)
	// is reused for both games, so the app should treat both as one player.
	const nickname = `E2E-Repeat-${Date.now()}`;

	await startNewGame(page, { nickname, level: 'N4' });
	await playFullGame(page);
	const firstScore = Number((await page.locator('.score-number').textContent())?.trim() ?? '0');

	await startNewGame(page, { nickname, level: 'N4' });
	await playFullGame(page);
	const secondScore = Number((await page.locator('.score-number').textContent())?.trim() ?? '0');

	const bestScore = Math.max(firstScore, secondScore);

	await page.goto('/leaderboard?level=N4');

	const rowsForPlayer = page.getByRole('row').filter({ hasText: nickname });
	await expect(rowsForPlayer).toHaveCount(1);
	await expect(rowsForPlayer).toContainText(String(bestScore));
});
