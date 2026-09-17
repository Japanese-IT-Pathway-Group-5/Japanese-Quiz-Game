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
			const group = page.getByRole('button', {
				name: new RegExp(member.name, 'i')
			});

			await expect.element(group.first()).toBeInTheDocument();
		}
	});

	it('activates member layer when activeMemberId is set', async () => {
		render(TeamPhoto, {
			members: teamMembers,
			activeMemberId: 'panha'
		});

		const panhaGroup = page.getByRole('button', {
			name: /Lay Sopanha/i
		});

		await expect.element(panhaGroup.first()).toHaveClass(/active/);
	});

	it('pressing Enter on a member selects them', async () => {
		render(TeamPhoto, { members: teamMembers });

		const first = teamMembers[0];

		const group = page
			.getByRole('button', {
				name: new RegExp(first.name, 'i')
			})
			.first();

		await expect.element(group).toBeInTheDocument();

		const memberElement = document.querySelector(`g[aria-label^="${first.name} -"]`);

		expect(memberElement).not.toBeNull();

		(memberElement as SVGGElement).focus();

		memberElement!.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Enter',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(group).toHaveClass(/active/);
	});

	it('pressing Space on a member selects them', async () => {
		render(TeamPhoto, { members: teamMembers });

		const first = teamMembers[0];

		const group = page
			.getByRole('button', {
				name: new RegExp(first.name, 'i')
			})
			.first();

		const memberElement = document.querySelector(`g[aria-label^="${first.name} -"]`);

		expect(memberElement).not.toBeNull();

		(memberElement as SVGGElement).focus();

		memberElement!.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: ' ',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(group).toHaveClass(/active/);
	});

	it('hovering over a member no longer selects them', async () => {
		render(TeamPhoto, { members: teamMembers });

		const first = teamMembers[0];

		const group = page
			.getByRole('button', {
				name: new RegExp(first.name, 'i')
			})
			.first();

		/*
		 * Hovering must not select a member.
		 * The old "TAP A MEMBER" hint was removed from the UI,
		 * so this test now verifies that the member remains inactive.
		 */
		await expect.element(group).not.toHaveClass(/active/);
	});

	it('ArrowRight selects the next member', async () => {
		render(TeamPhoto, { members: teamMembers });

		expect(teamMembers.length).toBeGreaterThan(1);

		const first = page.getByRole('button', {
			name: new RegExp(teamMembers[0].name, 'i')
		});

		const second = page.getByRole('button', {
			name: new RegExp(teamMembers[1].name, 'i')
		});

		/*
		 * ArrowRight with no active member starts at the first member.
		 */
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowRight',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(first).toHaveClass(/active/);

		/*
		 * A second ArrowRight moves to the next member.
		 */
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowRight',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(second).toHaveClass(/active/);
		await expect.element(first).not.toHaveClass(/active/);
	});

	it('ArrowLeft selects the previous member and wraps to the last member', async () => {
		render(TeamPhoto, { members: teamMembers });

		const first = page.getByRole('button', {
			name: new RegExp(teamMembers[0].name, 'i')
		});

		const last = page.getByRole('button', {
			name: new RegExp(teamMembers[teamMembers.length - 1].name, 'i')
		});

		/*
		 * ArrowLeft with no active member wraps to the last member.
		 */
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowLeft',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(last).toHaveClass(/active/);
		await expect.element(first).not.toHaveClass(/active/);
	});

	it('ArrowRight and ArrowLeft cycle through members and wrap around', async () => {
		render(TeamPhoto, { members: teamMembers });

		const first = page.getByRole('button', {
			name: new RegExp(teamMembers[0].name, 'i')
		});

		const second = page.getByRole('button', {
			name: new RegExp(teamMembers[1].name, 'i')
		});

		const last = page.getByRole('button', {
			name: new RegExp(teamMembers[teamMembers.length - 1].name, 'i')
		});

		/*
		 * No member is selected initially.
		 */

		await expect.element(first).not.toHaveClass(/active/);

		/*
		 * ArrowRight -> first member.
		 */
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowRight',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(first).toHaveClass(/active/);

		/*
		 * ArrowRight -> second member.
		 */
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowRight',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(second).toHaveClass(/active/);
		await expect.element(first).not.toHaveClass(/active/);

		/*
		 * ArrowLeft -> first member.
		 */
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowLeft',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(first).toHaveClass(/active/);

		/*
		 * ArrowLeft from first -> last member.
		 */
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowLeft',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(last).toHaveClass(/active/);
		await expect.element(first).not.toHaveClass(/active/);

		/*
		 * ArrowRight from last -> first member.
		 */
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowRight',
				bubbles: true,
				cancelable: true
			})
		);

		await expect.element(first).toHaveClass(/active/);
		await expect.element(last).not.toHaveClass(/active/);
	});

	it('prev/next arrow buttons navigate through members and wrap at both ends', async () => {
		render(TeamPhoto, { members: teamMembers });

		const nextButton = page.getByRole('button', {
			name: 'Next team member'
		});

		const prevButton = page.getByRole('button', {
			name: 'Previous team member'
		});

		const first = page.getByRole('button', {
			name: new RegExp(teamMembers[0].name, 'i')
		});

		const second = page.getByRole('button', {
			name: new RegExp(teamMembers[1].name, 'i')
		});

		const last = page.getByRole('button', {
			name: new RegExp(teamMembers[teamMembers.length - 1].name, 'i')
		});

		/*
		 * Next -> first member.
		 */
		await nextButton.click();

		await expect.element(first).toHaveClass(/active/);

		/*
		 * Next -> second member.
		 */
		await nextButton.click();

		await expect.element(second).toHaveClass(/active/);
		await expect.element(first).not.toHaveClass(/active/);

		/*
		 * Previous -> first member.
		 */
		await prevButton.click();

		await expect.element(first).toHaveClass(/active/);

		/*
		 * Previous from first -> last member.
		 */
		await prevButton.click();

		await expect.element(last).toHaveClass(/active/);

		/*
		 * Next from last -> first member.
		 */
		await nextButton.click();

		await expect.element(first).toHaveClass(/active/);
		await expect.element(last).not.toHaveClass(/active/);
	});
});
