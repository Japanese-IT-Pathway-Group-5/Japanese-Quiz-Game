import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TypingQuestion from './TypingQuestion.svelte';

describe('TypingQuestion.svelte', () => {
	it('renders a labeled, focused text input', async () => {
		render(TypingQuestion, { questionId: 'q1' });

		const input = page.getByLabelText('Your answer');
		await expect.element(input).toBeVisible();
		await expect.element(input).toHaveFocus();
	});

	it('disables autocorrect, autocapitalize, autocomplete, and spellcheck', async () => {
		render(TypingQuestion, { questionId: 'q1' });

		const input = page.getByLabelText('Your answer');
		await expect.element(input).toHaveAttribute('autocorrect', 'off');
		await expect.element(input).toHaveAttribute('autocapitalize', 'off');
		await expect.element(input).toHaveAttribute('autocomplete', 'off');
		await expect.element(input).toHaveAttribute('spellcheck', 'false');
	});

	it('marks the field as required so empty submission is blocked natively', async () => {
		render(TypingQuestion, { questionId: 'q1' });

		const input = page.getByLabelText('Your answer');
		await expect.element(input).toHaveAttribute('required');
	});

	it('has name="answer" so it posts correctly inside the parent form', async () => {
		render(TypingQuestion, { questionId: 'q1' });

		const input = page.getByLabelText('Your answer');
		await expect.element(input).toHaveAttribute('name', 'answer');
	});

	it('refocuses when given a new questionId', async () => {
		const { rerender } = render(TypingQuestion, { questionId: 'q1' });

		await rerender({ questionId: 'q2' });

		const input = page.getByLabelText('Your answer');
		await expect.element(input).toHaveFocus();
	});
});
