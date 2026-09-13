import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SarcasticStickman from './SarcasticStickman.svelte';

describe('SarcasticStickman.svelte', () => {
	it('renders animated stickman graphic', async () => {
		render(SarcasticStickman);

		const img = page.getByAltText('Sarcastic stickman');
		await expect.element(img).toBeInTheDocument();
		await expect.element(img).toHaveAttribute('src', '/images/stickman-open.png');
	});
});
