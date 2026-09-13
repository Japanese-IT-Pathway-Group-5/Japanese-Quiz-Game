import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TeamPhoto from './TeamPhoto.svelte';
import { teamMembers } from '$lib/credits';

describe('TeamPhoto.svelte', () => {
	it('renders the team photo SVG and all member elements', async () => {
		render(TeamPhoto, { members: teamMembers });

		const svg = page.getByLabelText('Japanese Quiz Game Development Team Photo');
		await expect.element(svg).toBeVisible();

		for (const member of teamMembers) {
			const group = page.getByRole('button', { name: new RegExp(member.name, 'i') });
			await expect.element(group.first()).toBeInTheDocument();
		}
	});

	it('activates member layer when activeMemberId is set', async () => {
		render(TeamPhoto, { members: teamMembers, activeMemberId: 'panha' });

		const panhaGroup = page.getByRole('button', { name: /Lay Sopanha/i });
		await expect.element(panhaGroup.first()).toBeInTheDocument();
	});
});
