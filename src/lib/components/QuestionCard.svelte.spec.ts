import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import QuestionCard from './QuestionCard.svelte';

describe('QuestionCard.svelte', () => {
	it('renders multiple-choice options and allows one option to be selected', async () => {
		const question = {
			id: 'q1',
			format: 'multiple_choice',
			prompt: 'What is the meaning of 「案内する」 (あんないする)?',
			promptJa: '案内する',
			choices: [
				{ id: 'c1', text: 'To guide / show around' },
				{ id: 'c2', text: 'To invite' },
				{ id: 'c3', text: 'To prepare' }
			]
		} as const;

		render(QuestionCard, { question });

		const firstOption = page.getByRole('radio', { name: 'To guide / show around' });
		const secondOption = page.getByRole('radio', { name: 'To invite' });

		await expect.element(firstOption).toBeVisible();
		await expect.element(secondOption).toBeVisible();

		await firstOption.click();

		await expect.element(firstOption).toBeChecked();
		await expect.element(secondOption).not.toBeChecked();
	});

	it('renders gap-fill prompts with a visible blank in the sentence', async () => {
		const question = {
			id: 'q2',
			format: 'gap_fill',
			prompt: 'Choose the correct particle for the blank.',
			promptJa: '日曜日 [ ___ ] 友達と映画を見に行きます。',
			choices: [
				{ id: 'c1', text: 'に' },
				{ id: 'c2', text: 'で' },
				{ id: 'c3', text: 'を' }
			]
		} as const;

		render(QuestionCard, { question });

		await expect.element(page.getByText('日曜日')).toBeVisible();
		await expect.element(page.getByText('友達と映画を見に行きます。')).toBeVisible();
		await expect.element(page.getByText('_____')).toBeVisible();
	});

	it('renders a typing input for typing questions and normalizes the answer', async () => {
		const question = {
			id: 'q3',
			format: 'typing',
			prompt: 'Type the Japanese word for “clear”.',
			promptJa: '透明',
			choices: []
		} as const;

		render(QuestionCard, { question });

		const input = page.getByLabelText('Your answer');

		await expect.element(input).toBeVisible();
		await input.fill('toumei');

		await expect.element(page.getByText('Normalized answer: とうめい')).toBeVisible();
	});
});
