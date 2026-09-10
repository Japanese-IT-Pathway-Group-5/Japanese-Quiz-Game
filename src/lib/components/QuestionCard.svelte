<script lang="ts">
	type Choice = {
		id: string;
		text: string;
	};

	type Question = {
		id: string;
		format: 'multiple_choice' | 'gap_fill' | 'word_ordering' | 'typing';
		prompt: string;
		promptJa?: string | null;
		choices?: readonly Choice[];
	};

	let { question }: { question: Question } = $props();
	let selectedChoiceId: string | null = $state(null);

	const blankMarker = '_____' as const;

	function renderGapFillSentence(text: string) {
		if (!text.includes('___')) {
			return [{ type: 'text', value: text }];
		}

		const segments = text.split(/(_____|___)/);
		return segments.map((segment) => {
			if (segment === '___' || segment === '_____') {
				return { type: 'blank', value: blankMarker };
			}

			return { type: 'text', value: segment };
		});
	}

	function getQuestionText() {
		return question.promptJa ?? question.prompt;
	}
</script>

<div class="question-card">
	<h2 class="question-title">Question</h2>

	{#if question.format === 'gap_fill'}
		<p class="prompt prompt-gap">
			{#each renderGapFillSentence(getQuestionText()) as part, index (part.type + '-' + index + '-' + part.value)}
				{#if part.type === 'blank'}
					<span class="gap-blank">{part.value}</span>
				{:else}
					<span>{part.value}</span>
				{/if}
			{/each}
		</p>
	{:else}
		<p class="prompt">{getQuestionText()}</p>
	{/if}

	{#if question.format === 'multiple_choice' && question.choices}
		<ul class="options" role="radiogroup" aria-label="Answer choices">
			{#each question.choices as choice (choice.id)}
				<li>
					<label class:selected={selectedChoiceId === choice.id} class="option">
						<input
							type="radio"
							name={question.id}
							value={choice.id}
							bind:group={selectedChoiceId}
						/>
						<span class="option-text">{choice.text}</span>
					</label>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.question-card {
		width: min(100%, 720px);
		margin: 0 auto;
		padding: 1rem;
	}

	.question-title {
		font-size: clamp(1rem, 2vw, 1.2rem);
		margin-bottom: 0.75rem;
	}

	.prompt {
		font-size: clamp(1.1rem, 2.5vw, 1.5rem);
		line-height: 1.7;
		margin: 0 0 1rem;
		word-break: break-word;
	}

	.prompt-gap {
		display: inline-block;
	}

	.gap-blank {
		display: inline-block;
		min-width: 4.5rem;
		padding: 0 0.35rem;
		border-bottom: 3px solid #3b82f6;
		text-align: center;
		font-weight: 700;
	}

	.options {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.9rem 1rem;
		border: 2px solid #d1d5db;
		border-radius: 0.9rem;
		background: #ffffff;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			background 0.15s ease,
			transform 0.15s ease;
	}

	.option:hover {
		border-color: #60a5fa;
		background: #f8fbff;
	}

	.option:has(input:focus-visible) {
		outline: 3px solid #2563eb;
		outline-offset: 3px;
	}

	.option.selected {
		border-color: #2563eb;
		background: #eff6ff;
	}

	.option input {
		width: 1.2rem;
		height: 1.2rem;
		margin: 0;
		accent-color: #2563eb;
		flex-shrink: 0;
	}

	.option-text {
		font-size: clamp(1rem, 2vw, 1.25rem);
		line-height: 1.5;
		flex: 1;
	}

	@media (max-width: 480px) {
		.question-card {
			padding: 0.75rem;
		}

		.option {
			padding: 0.8rem 0.85rem;
		}
	}
</style>
