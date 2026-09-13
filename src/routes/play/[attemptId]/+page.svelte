<script lang="ts">
	import type { PageData } from './$types';
	import TypingQuestion from '$lib/components/TypingQuestion.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Timer from '$lib/components/Timer.svelte';

	let { data }: { data: PageData } = $props();

	const question = $derived(data.question);
	const attempt = $derived(data.attempt);
	const totalQuestions = $derived((attempt.chosenQuestions ?? []).length);
	const currentQuestionNumber = $derived(
		Math.min(attempt.currentQuestionIndex + 1, totalQuestions)
	);

	let questionStartTime = $state(Date.now());
	$effect(() => {
		void question.id; // Subscribe to question id changes
		questionStartTime = Date.now();
	});

	function renderGapFillSentence(text: string) {
		if (!text.includes('___')) {
			return [{ type: 'text', value: text }];
		}

		const segments = text.split(/(_____|___)/);
		return segments.map((segment) => {
			if (segment === '___' || segment === '_____') {
				return { type: 'blank', value: '_____' };
			}

			return { type: 'text', value: segment };
		});
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<main class="page-shell">
	<div class="quiz-card">
		<div class="top-bar">
			<ProgressBar current={currentQuestionNumber} total={totalQuestions} />
			<div class="right-stats">
				<Timer startedAt={new Date(attempt.startedAt)} />
				<div class="score-badge">
					<span class="score-label">Score</span>
					<span class="score-value">{attempt.correctCount}</span>
				</div>
			</div>
		</div>

		<h1 class="title">Quiz</h1>

		<form
			method="POST"
			class="answer-form"
			onsubmit={() => {
				const ds = document.getElementById('durationSeconds') as HTMLInputElement;
				if (ds)
					ds.value = Math.max(0, Math.floor((Date.now() - questionStartTime) / 1000)).toString();
			}}
		>
			<input type="hidden" name="questionId" value={question.id} />
			<input type="hidden" id="durationSeconds" name="durationSeconds" value="0" />

			{#if question.format === 'gap_fill'}
				<p class="prompt prompt-gap">
					{#each renderGapFillSentence(question.promptJa ?? question.prompt) as part, index (part.type + '-' + index + '-' + part.value)}
						{#if part.type === 'blank'}
							<span class="gap-blank">{part.value}</span>
						{:else}
							<span>{part.value}</span>
						{/if}
					{/each}
				</p>
			{:else}
				<p class="prompt">{question.promptJa ?? question.prompt}</p>
			{/if}

			{#if question.format === 'multiple_choice' || question.format === 'gap_fill'}
				<div class="choices">
					{#each question.choices as choice (choice.id)}
						<label class="choice-option">
							<input type="radio" name="answer" value={choice.id} required />
							<span>{choice.text}</span>
						</label>
					{/each}
				</div>
			{/if}

			{#if question.format === 'typing'}
				<TypingQuestion questionId={question.id} />
			{/if}

			{#if question.format === 'word_ordering'}
				<div class="word-ordering">
					{#each question.choices as choice, index (choice.id)}
						<label class="field-label" for={`answer-${index}`}>
							Word {index + 1}
						</label>
						<select id={`answer-${index}`} name={`answer-${index}`} required>
							<option value="">Choose a word</option>
							{#each question.choices as option (option.id)}
								<option value={option.text}>{option.text}</option>
							{/each}
						</select>
					{/each}
				</div>
			{/if}

			<button type="submit" class="submit-button">Submit answer</button>
		</form>
	</div>
</main>

<style>
	.quiz-card {
		max-width: 760px;
	}

	.top-bar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--color-border);
	}

	.right-stats {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.score-badge {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--color-surface-muted);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0.35rem 0.85rem;
	}

	.score-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--color-text-muted);
		letter-spacing: 0.05em;
	}

	.score-value {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.title {
		margin: 0 0 1rem;
		font-size: clamp(1.5rem, 3vw, 2.25rem);
	}

	.answer-form {
		display: grid;
		gap: 1rem;
	}

	.prompt {
		margin: 0;
		font-size: clamp(1.05rem, 2.2vw, 1.5rem);
		line-height: 1.7;
		overflow-wrap: anywhere;
	}

	.prompt-gap {
		display: inline-block;
	}

	.gap-blank {
		display: inline-block;
		min-width: 4.5rem;
		padding: 0 0.3rem;
		border-bottom: 3px solid var(--color-primary);
		text-align: center;
		font-weight: 700;
	}

	.choices {
		display: grid;
		gap: 0.75rem;
	}

	.choice-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.9rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface-muted);
		color: var(--color-text);
		cursor: pointer;
	}

	.choice-option:hover {
		border-color: var(--color-primary);
		background: var(--color-primary-soft);
	}

	.choice-option input {
		width: 1.2rem;
		height: 1.2rem;
		margin: 0;
		accent-color: var(--color-primary);
		flex-shrink: 0;
	}

	.field-label {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.word-ordering {
		display: grid;
		gap: 0.6rem;
	}

	@media (max-width: 480px) {
		.top-bar {
			flex-direction: column;
		}
	}
</style>
