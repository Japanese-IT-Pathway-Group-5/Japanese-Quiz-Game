import type { Page } from '@playwright/test';

/**
 * Starts a new quiz attempt from the home page and waits until we land on
 * /play/[attemptId].
 */
export async function startNewGame(
	page: Page,
	{ nickname, level = 'N4' }: { nickname: string; level?: 'N4' | 'N3' } = { nickname: 'Player' }
) {
	await page.goto('/');
	await page.locator('#nickname').fill(nickname);
	await page.locator('label.level-segment', { hasText: level }).click();
	await page.getByRole('button', { name: 'Start Quiz' }).click();
	await page.waitForURL(/\/play\//);
}

/**
 * Fills in *some* valid answer for whatever question is currently showing,
 * without submitting anything.
 */
async function selectAnswerForCurrentQuestion(page: Page): Promise<void> {
	const wordBank = page.locator('.word-bank-area .word-chip');
	const typingInput = page.locator('#typing-input');

	if ((await wordBank.count()) > 0) {
		// Clicking a bank chip drops it into the first empty slot, so clicking
		// whatever's left in the bank repeatedly fills every slot.
		const chipCount = await wordBank.count();
		for (let i = 0; i < chipCount; i++) {
			await wordBank.first().click();
		}
	} else if ((await typingInput.count()) > 0) {
		// Almost certainly wrong, which is fine - we never depend on correctness
		// being read back from the client.
		await typingInput.fill('placeholder-answer');
	} else {
		// multiple_choice or gap_fill
		await page.locator('.choice-item').first().click();
	}
}

/**
 * Answers the current question and advances via the "Next"/"Save" button.
 * NOTE: this button never finishes the quiz, even on the last question - see
 * playFullGame, which uses the separate "Finish Quiz" button for that.
 */
export async function answerCurrentQuestion(page: Page): Promise<void> {
	await selectAnswerForCurrentQuestion(page);

	const prevCounter = await page.locator('.question-number').textContent();
	await page.locator('button.next-btn').click();

	await page.waitForFunction((prev) => {
		const el = document.querySelector('.question-number');
		return el ? el.textContent !== prev : false;
	}, prevCounter);
}

/**
 * Plays every remaining question on an in-progress /play/[attemptId] page
 * until the quiz is finished.
 *
 * The "Next"/"Save" button only ever advances/saves in place - it never
 * navigates, not even on the last question. Finishing the quiz requires the
 * separate "Finish Quiz" button (src/routes/play/[attemptId]/+page.svelte),
 * which submits the currently-selected answer along with `finish=true` and
 * is the only thing that navigates to /results/[attemptId].
 *
 * Correctness isn't tracked here - read the final score off the results page
 * instead (e.g. `.score-number`), since the app never exposes per-question
 * correctness to the client.
 */
export async function playFullGame(page: Page): Promise<{ totalAnswered: number }> {
	let totalAnswered = 0;

	// Guard against an infinite loop if something regresses - 10 is today's
	// DEFAULT_QUESTION_COUNT (src/lib/server/quiz/attempts.ts), give some
	// headroom in case that number changes later.
	const MAX_QUESTIONS = 50;

	while (totalAnswered < MAX_QUESTIONS) {
		const counterText = (await page.locator('.question-number').textContent()) ?? '';
		const match = counterText.match(/(\d+)\D+(\d+)/);
		const isLastQuestion = !!match && match[1] === match[2];

		await selectAnswerForCurrentQuestion(page);

		if (isLastQuestion) {
			await page.getByRole('button', { name: 'Finish Quiz' }).click();
			await page.waitForURL(/\/results\//);
			totalAnswered++;
			break;
		}

		const prevCounter = counterText;
		await page.locator('button.next-btn').click();
		await page.waitForFunction((prev) => {
			const el = document.querySelector('.question-number');
			return el ? el.textContent !== prev : false;
		}, prevCounter);
		totalAnswered++;
	}

	return { totalAnswered };
}
