import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ProgressBar from './ProgressBar.svelte';

describe('ProgressBar.svelte', () => {
	it('renders the correct progress text', async () => {
		render(ProgressBar, { current: 2, total: 10 });
		const text = page.getByText('Question 2 of 10');
		await expect.element(text).toBeVisible();
	});

	it('renders a progress element with correct value and max attributes', async () => {
		render(ProgressBar, { current: 5, total: 20 });
		const progress = page.getByRole('progressbar');
		await expect.element(progress).toHaveAttribute('value', '5');
		await expect.element(progress).toHaveAttribute('max', '20');
	});
});
