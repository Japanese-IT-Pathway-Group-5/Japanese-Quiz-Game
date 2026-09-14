import { test, expect } from '@playwright/test';
import { startNewGame, answerCurrentQuestion } from './support/helpers';

// If any of these strings ever show up in a /play/ response body, a secret is
// leaking to the client: the correct choice, the accepted typed answers, or
// the explanation text. toClientQuestion() (src/lib/quiz/toClientQuestion.ts)
// is what's supposed to strip all of this before a question reaches the
// browser - this test is the tripwire if that ever regresses.
const FORBIDDEN_SUBSTRINGS = ['acceptedAnswers', 'explanation', 'isCorrect', 'correctAnswer'];

test('the quiz page never sends the correct answer, accepted answers, or explanation to the browser', async ({
	page
}) => {
	const capturedBodies: string[] = [];

	page.on('response', async (response) => {
		const url = response.url();
		if (!url.includes('/play/')) return;

		const contentType = response.headers()['content-type'] ?? '';
		if (!contentType.includes('text') && !contentType.includes('json')) return;

		try {
			capturedBodies.push(await response.text());
		} catch {
			// Body already consumed or unavailable (e.g. redirected away) - skip it.
		}
	});

	await startNewGame(page, { nickname: `E2E-Leak-${Date.now()}`, level: 'N4' });

	// Answer a question too, so we also capture the response SvelteKit sends
	// after the form submits (the SSR'd next question / the __data.json SvelteKit
	// fetches for the client-side navigation).
	await answerCurrentQuestion(page);

	expect(capturedBodies.length).toBeGreaterThan(0);

	for (const body of capturedBodies) {
		for (const forbidden of FORBIDDEN_SUBSTRINGS) {
			expect(body).not.toContain(forbidden);
		}
	}
});
