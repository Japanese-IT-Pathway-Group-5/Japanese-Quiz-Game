<script lang="ts">
	type Choice = {
		id: string;
		text: string;
	};

	type Question = {
		id: string;
		format: 'word_ordering';
		prompt: string;
		promptJa?: string | null;
		choices?: readonly Choice[];
	};

	let { question, onSubmit }: { question: Question; onSubmit?: (sentence: string[]) => void } =
		$props();

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
		font-size: clamp(1rem, 2vw, 1.2rem);
		margin: 0;
	}

	.prompt {
		font-size: clamp(1.1rem, 2.5vw, 1.5rem);
		line-height: 1.7;
		margin: 0;
		word-break: break-word;
	}

	.sentence-box,
	.word-bank {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 2px solid #cbd5e1;
		border-radius: 0.75rem;
		background: rgb(255 255 255 / 0.95);
		min-height: 4rem;
	}

	.word-bank {
		min-height: 4.5rem;
	}

	.empty-state {
		color: #64748b;
		font-size: 1rem;
	}

	.word-chip {
		padding: 0.7rem 1rem;
		border-radius: 999px;
		border: 1px solid #94a3b8;
		background: #f8fafc;
		font-size: 1rem;
		line-height: 1.2;
		cursor: pointer;
	}

	.word-chip.primary {
		background: #eff6ff;
		border-color: #60a5fa;
	}

	.submit-button {
		padding: 0.85rem 1.1rem;
		border: none;
		border-radius: 0.75rem;
		background: #2563eb;
		color: white;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}

	.submit-button:disabled {
		background: #cbd5e1;
		cursor: not-allowed;
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
