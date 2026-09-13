<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const question = $derived(data.question);
	const attempt = $derived(data.attempt);
	const totalQuestions = $derived((attempt.chosenQuestions ?? []).length);
	const currentQuestionNumber = $derived(
		Math.min(attempt.currentQuestionIndex + 1, totalQuestions)
	);

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
			<p class="meta">Question {currentQuestionNumber} of {totalQuestions}</p>
			<p class="meta">Score: {attempt.correctCount}</p>
		</div>

		<h1 class="title">Quiz</h1>

		<form method="POST" class="answer-form">
			<input type="hidden" name="questionId" value={question.id} />

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
				<label class="field-label" for="answer">Your answer</label>
				<input
					id="answer"
					class="text-input"
					type="text"
					name="answer"
					autocomplete="off"
					required
				/>
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
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.meta {
		margin: 0;
		font-size: 0.95rem;
		color: #475569;
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

	.text-input,
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
