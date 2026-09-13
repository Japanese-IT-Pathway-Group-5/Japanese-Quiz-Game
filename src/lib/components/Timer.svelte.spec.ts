import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Timer from './Timer.svelte';

describe('Timer.svelte', () => {
	it('formats the elapsed time correctly', async () => {
		// Mock a start time exactly 65 seconds ago (1 min 5 secs)
		const startedAt = new Date(Date.now() - 65000);
		render(Timer, { startedAt });

		const timerText = page.getByText('01:05');
		await expect.element(timerText).toBeVisible();
	});

	it('handles zero seconds correctly', async () => {
		const startedAt = new Date(Date.now());
		render(Timer, { startedAt });

		const timerText = page.getByText('00:00');
		await expect.element(timerText).toBeVisible();
	});
});
