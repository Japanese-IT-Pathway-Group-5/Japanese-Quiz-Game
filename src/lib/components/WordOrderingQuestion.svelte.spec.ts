import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import WordOrderingQuestion from './WordOrderingQuestion.svelte';

describe('WordOrderingQuestion.svelte', () => {
	it('shows shuffled words, builds a sentence by tapping, and keeps submit disabled until all words are placed', async () => {
		const question = {
			id: 'q-word-ordering-1',
			format: 'word_ordering',
			prompt: 'Arrange the words into a correct sentence.',
			promptJa: '私は日本語を上手に話せるようになりたいです。',
			choices: [
				{ id: 'c1', text: '私は' },
				{ id: 'c2', text: '日本語を' },
				{ id: 'c3', text: '上手に' },
				{ id: 'c4', text: '話せるようになりたいです。' }
			]
		} as const;

		render(WordOrderingQuestion, { question });

		const wordBank = page.getByTestId('word-ordering-word-bank');
		const sentenceBox = page.getByTestId('word-ordering-sentence');
		const submitButton = page.getByRole('button', { name: 'Submit answer' });

		await expect.element(wordBank).toBeVisible();
		await expect.element(sentenceBox).toBeVisible();
		await expect.element(submitButton).toBeDisabled();

		const words = ['私は', '日本語を', '上手に', '話せるようになりたいです。'];

		for (const word of words) {
			const wordButton = page.getByRole('button', { name: word });
			await expect.element(wordButton).toBeVisible();
			await wordButton.click();
		}

		await expect.element(submitButton).toBeEnabled();
	});

	it('lets a player remove a word from the sentence and put it back', async () => {
		const question = {
			id: 'q-word-ordering-2',
			format: 'word_ordering',
			prompt: 'Arrange the words into a correct sentence.',
			choices: [
				{ id: 'c1', text: '私は' },
				{ id: 'c2', text: '日本語を' },
				{ id: 'c3', text: '上手に' },
				{ id: 'c4', text: '話せるようになりたいです。' }
			]
		} as const;

		render(WordOrderingQuestion, { question });

		const submitButton = page.getByRole('button', { name: 'Submit answer' });
		const word = '私は';

		await page.getByRole('button', { name: word }).click();
		await expect.element(submitButton).toBeDisabled();

		await page.getByRole('button', { name: word }).click();
		await expect.element(submitButton).toBeDisabled();
	});
});
