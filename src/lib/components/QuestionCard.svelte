<script lang="ts">
	import { normalizeTypedAnswer } from '$lib/quiz/normalizeTypedAnswer';
	import type { ClientQuestion } from '$lib/quiz/types';

	let { question }: { question: ClientQuestion } = $props();
	let selectedChoiceId: string | null = $state(null);
	let typedAnswer = $state('');

	const blankMarker = '\u00A0\u00A0\u00A0\u00A0\u00A0' as const;
	const normalizedAnswer = $derived(normalizeTypedAnswer(typedAnswer));

	function renderGapFillSentence(text: string) {
		const gapRegex = /(_{3,5}|（\s*）|\(\s*\)|\[\s*\])/g;
		if (!gapRegex.test(text)) {
			return [{ type: 'text', value: text }];
		}

		const segments = text.split(gapRegex);
		return segments.map((segment) => {
			if (/^(_{3,5}|（\s*）|\(\s*\)|\[\s*\])$/.test(segment)) {
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
			{#each renderGapFillSentence(getQuestionText()) as part, index (part.type + '-' + index)}
				{#if part.type === 'blank'}
					<span class="gap-blank" aria-label="blank">{part.value}</span>
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

	{#if question.format === 'typing'}
		<div class="typing-box">
			<label class="typing-label" for={question.id + '-answer'}>Your answer</label>
			<input
				id={question.id + '-answer'}
				class="typing-input"
				type="text"
				bind:value={typedAnswer}
				aria-label="Your answer"
			/>

			{#if typedAnswer.trim()}
				<p class="normalized-answer">Normalized answer: {normalizedAnswer}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.question-card {
		width: min(100%, 720px);
		margin: 0 auto;
		padding: 1rem;
	}

	.question-title {
		margin-bottom: 0.75rem;
		font-size: clamp(1rem, 2vw, 1.2rem);
	}

	.prompt {
		margin: 0 0 1rem;
		font-size: clamp(1.1rem, 2.5vw, 1.5rem);
		line-height: 1.7;
		overflow-wrap: anywhere;
	}

	.prompt-gap {
		display: inline-block;
	}

	.gap-blank {
		display: inline-block;
		min-width: 4.5rem;
		padding: 0 0.35rem;
		border-bottom: 3px solid var(--color-primary);
		text-align: center;
		font-weight: 700;
	}

	.options {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.95rem 1.15rem;
		border: 1px solid var(--theme-border, var(--color-border));
		border-radius: var(--radius-md);
		background: var(--theme-paper, var(--color-surface));
		color: var(--theme-text-main, var(--color-text));
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		user-select: none;
		box-shadow: 0 4px 14px rgba(0, 15, 45, 0.25);
	}

	.option:hover:not(.selected) {
		background: color-mix(in srgb, var(--theme-paper, #05367b) 75%, #1952a8 25%);
		border-color: rgba(255, 188, 13, 0.45);
		color: #ffffff;
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
	}

	.option.selected {
		background: var(--theme-gold-shimmer, #ffbc0d);
		border-color: var(--theme-gold, #ffbc0d);
		color: #022659;
		font-weight: 800;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
		transform: translateY(-2px);
	}

	.option.selected:hover {
		filter: brightness(1.05);
	}

	.option:active {
		transform: translateY(1px) scale(0.98);
		filter: brightness(0.96);
	}

	.option:has(input:focus-visible) {
		outline: 2px solid var(--theme-gold, #ffbc0d);
		outline-offset: 3px;
	}

	.option input {
		width: 1.2rem;
		height: 1.2rem;
		margin: 0;
		accent-color: var(--theme-gold, #ffbc0d);
		flex-shrink: 0;
		position: relative;
		z-index: 1;
	}

	.option-text {
		flex: 1;
		font-size: clamp(1rem, 2vw, 1.25rem);
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	.typing-box {
		display: grid;
		gap: 0.5rem;
	}

	.typing-label {
		font-size: 0.95rem;
		font-weight: 600;
	}

	.typing-input {
		width: 100%;
	}

	.normalized-answer {
		margin: 0;
		color: var(--color-primary);
		font-weight: 600;
	}

	@media (max-width: 640px) {
		.question-card {
			padding: 0.55rem;
		}

		.question-title {
			margin-bottom: 0.45rem;
			font-size: 0.8rem;
		}

		.prompt {
			margin-bottom: 0.65rem;
			font-size: 1rem;
			line-height: 1.45;
		}

		.option {
			gap: 0.5rem;
			padding: 0.58rem 0.65rem;
		}

		.option input {
			width: 1rem;
			height: 1rem;
		}

		.option-text {
			font-size: 0.82rem;
			line-height: 1.35;
		}
	}
</style>
