<script lang="ts">
	import type { ClientQuestion } from '$lib/quiz/types';

	let {
		question,
		onSubmit
	}: {
		question: ClientQuestion & { format: 'word_ordering' };
		onSubmit?: (sentence: string[]) => void;
	} = $props();

	let availableWords = $state<string[]>([]);
	let builtSentence = $state<string[]>([]);

	const totalWords = $derived((question.choices ?? []).length);
	const questionMeta = $derived(`${question.id}:${question.format}`);
	const canSubmit = $derived(builtSentence.length === totalWords && totalWords > 0);

	function shuffleWords(words: string[]) {
		const nextWords = [...words];

		for (let index = nextWords.length - 1; index > 0; index -= 1) {
			const swapIndex = Math.floor(Math.random() * (index + 1));
			[nextWords[index], nextWords[swapIndex]] = [nextWords[swapIndex], nextWords[index]];
		}

		return nextWords;
	}

	function resetQuestion() {
		availableWords = shuffleWords((question.choices ?? []).map((choice) => choice.text));
		builtSentence = [];
	}

	$effect(() => {
		resetQuestion();
	});

	function addWord(word: string) {
		if (!availableWords.includes(word)) {
			return;
		}

		availableWords = availableWords.filter((item) => item !== word);
		builtSentence = [...builtSentence, word];
	}

	function removeWord(index: number) {
		const [word] = builtSentence.splice(index, 1);
		availableWords = shuffleWords([...availableWords, word]);
	}

	function handleSubmit() {
		if (!canSubmit) {
			return;
		}

		onSubmit?.(builtSentence);
	}
</script>

<div class="word-ordering" data-question-meta={questionMeta}>
	<h2 class="title">Arrange the words</h2>

	<p class="prompt">{question.promptJa ?? question.prompt}</p>

	<div class="sentence-box" data-testid="word-ordering-sentence" aria-live="polite">
		{#if builtSentence.length === 0}
			<span class="empty-state">Tap words to build the sentence</span>
		{:else}
			{#each builtSentence as word, index (index)}
				<button class="word-chip" type="button" onclick={() => removeWord(index)}>
					{word}
				</button>
			{/each}
		{/if}
	</div>

	<div class="word-bank" data-testid="word-ordering-word-bank">
		{#each availableWords as word (word)}
			<button class="word-chip primary" type="button" onclick={() => addWord(word)}>
				{word}
			</button>
		{/each}
	</div>

	<button class="submit-button" type="button" disabled={!canSubmit} onclick={handleSubmit}>
		Submit answer
	</button>
</div>

<style>
	.word-ordering {
		display: grid;
		gap: 1rem;
		width: min(100%, 720px);
		margin: 0 auto;
		padding: 1rem;
	}

	.title {
		margin: 0;
		font-size: clamp(1rem, 2vw, 1.2rem);
	}

	.prompt {
		margin: 0;
		font-size: clamp(1.1rem, 2.5vw, 1.5rem);
		line-height: 1.7;
		overflow-wrap: anywhere;
	}

	.sentence-box,
	.word-bank {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		min-height: 4rem;
		padding: 0.75rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text);
	}

	.word-bank {
		min-height: 4.5rem;
	}

	.empty-state {
		color: var(--color-text-muted);
		font-size: 1rem;
	}

	.word-chip {
		width: auto;
		min-height: 0;
		padding: 0.7rem 1.15rem;
		border: 1px solid var(--theme-border, var(--color-border));
		border-radius: 999px;
		background: var(--theme-paper, var(--color-surface-muted));
		color: var(--theme-text-main, var(--color-text));
		font-size: 1rem;
		line-height: 1.2;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		user-select: none;
		box-shadow: 0 4px 12px rgba(0, 15, 45, 0.2);
	}

	.word-chip:hover {
		background: color-mix(in srgb, var(--theme-paper, #05367b) 75%, #1952a8 25%);
		border-color: rgba(255, 188, 13, 0.45);
		color: #ffffff;
		transform: translateY(-2px);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}

	.word-chip:active {
		transform: translateY(1px) scale(0.98);
		filter: brightness(0.96);
	}

	.word-chip.primary {
		background: var(--theme-paper, var(--color-surface-muted));
		border-color: rgba(255, 188, 13, 0.35);
		color: var(--theme-text-main);
	}

	.word-chip.primary:hover {
		background: color-mix(in srgb, var(--theme-paper, #05367b) 75%, #1952a8 25%);
		border-color: rgba(255, 188, 13, 0.6);
		color: #ffffff;
	}

	.submit-button {
		padding: 0.85rem 1.5rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--theme-gold, #ffbc0d);
		background: var(--theme-gold-shimmer, #ffbc0d);
		color: #022659;
		font-weight: 800;
		font-size: 1rem;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow:
			0 4px 14px rgba(255, 188, 13, 0.3),
			inset 0 1px 1px rgba(255, 255, 255, 0.6),
			inset 0 -1px 2px rgba(180, 110, 0, 0.35);
		user-select: none;
	}

	.submit-button:hover:not(:disabled) {
		transform: translateY(-2px);
		filter: brightness(1.05);
		box-shadow:
			0 8px 24px rgba(255, 188, 13, 0.5),
			inset 0 1px 1px rgba(255, 255, 255, 0.7),
			inset 0 -1px 2px rgba(180, 110, 0, 0.4);
	}

	.submit-button:active:not(:disabled) {
		transform: translateY(1px) scale(0.98);
		filter: brightness(0.96);
		box-shadow: 0 2px 6px rgba(0, 15, 45, 0.2);
	}

	.submit-button:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		transform: none !important;
		box-shadow: none !important;
	}

	@media (max-width: 480px) {
		.word-ordering {
			padding: 0.75rem;
		}

		.word-chip,
		.submit-button {
			font-size: 1.05rem;
		}
	}
</style>
