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
		question.id; // Subscribe to question id changes
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
	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
		background: linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%);
	}

	.page-shell {
		min-height: 100vh;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.quiz-card {
		width: min(100%, 760px);
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid #dbeafe;
		border-radius: 1rem;
		box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
		padding: 1.5rem;
	}

	.top-bar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid #e2e8f0;
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
		background: #f8fafc;
		border: 1px solid #cbd5e1;
		border-radius: 0.75rem;
		padding: 0.35rem 0.85rem;
	}

	.score-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		font-weight: 700;
		color: #64748b;
		letter-spacing: 0.05em;
	}

	.score-value {
		font-size: 1.1rem;
		font-weight: 700;
		color: #0f172a;
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
		word-break: break-word;
	}

	.prompt-gap {
		display: inline-block;
	}

	.gap-blank {
		display: inline-block;
		min-width: 4.5rem;
		padding: 0 0.3rem;
		border-bottom: 3px solid #2563eb;
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
		padding: 0.9rem 1rem;
		border: 2px solid #cbd5e1;
		border-radius: 0.9rem;
		background: #f8fafc;
		cursor: pointer;
	}

	.choice-option input {
		transform: scale(1.2);
	}

	.field-label {
		font-size: 0.95rem;
		font-weight: 700;
		color: #1e293b;
	}

	select {
		width: 100%;
		padding: 0.85rem 1rem;
		border: 2px solid #cbd5e1;
		border-radius: 0.8rem;
		font-size: 1rem;
		background: white;
	}

	.word-ordering {
		display: grid;
		gap: 0.6rem;
	}

	.submit-button {
		padding: 0.9rem 1.1rem;
		border: 0;
		border-radius: 0.8rem;
		background: #2563eb;
		color: white;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
	}

	@media (max-width: 480px) {
		.page-shell {
			padding: 1rem;
		}

		.quiz-card {
			padding: 1rem;
		}

		.top-bar {
			flex-direction: column;
		}
	}
</style>
