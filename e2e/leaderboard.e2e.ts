import { test, expect } from '@playwright/test';
import { startNewGame, playFullGame } from './support/helpers';

test('a finished game puts the players nickname on the leaderboard', async ({ page }) => {
	const nickname = `E2E-${Date.now()}`;

	await startNewGame(page, { nickname, level: 'N4' });
	await playFullGame(page);

	await page.goto('/leaderboard?level=N4');

	await expect(page.getByRole('cell', { name: nickname })).toBeVisible();
});
