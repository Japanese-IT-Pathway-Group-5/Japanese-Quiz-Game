<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const attempt = $derived(data.attempt);
	const questionResults = $derived(data.questionResults);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};
</script>

<svelte:head>
	<title>Quiz Results</title>
</svelte:head>

<main class="page-shell">
	<div class="results-card">
		<header class="results-header">
			<h1>Quiz Results</h1>
			<p>Review your answers and see where you can improve.</p>
		</header>

		<section class="summary" aria-label="Quiz summary">
			<div class="summary-item">
				<span>Final Score</span>
				<strong>{attempt.finalScore ?? 0}</strong>
			</div>

			<div class="summary-item">
				<span>Correct</span>
				<strong>{attempt.correctCount} / {attempt.chosenQuestions.length}</strong>
			</div>

			<div class="summary-item">
				<span>Time</span>
				<strong>{formatTime(data.timeTaken)}</strong>
			</div>
		</section>

		<section class="questions" aria-labelledby="review-title">
			<div class="section-heading">
				<h2 id="review-title">Question Review</h2>
				<p>{questionResults.length} questions</p>
			</div>

			{#if questionResults.length === 0}
				<div class="empty-state">
					<p>No question results are available.</p>
				</div>
			{:else}
				<div class="question-list">
					{#each questionResults as question, index (question.questionId)}
						<article
							class:correct={question.isCorrect}
							class:wrong={!question.isCorrect}
							class="question-result"
						>
							<div class="question-header">
								<h3>Question {index + 1}</h3>

								<span class="result-badge">
									{question.isCorrect ? 'Correct' : 'Wrong'}
								</span>
							</div>

							<p class="prompt">{question.prompt}</p>

							<div class="answer-section">
								<p>
									<strong>Your answer</strong>
									<span>{question.answer || 'No answer'}</span>
								</p>

								{#if !question.isCorrect}
									<p class="correct-answer">
										<strong>Correct answer</strong>
										<span>{question.correctAnswers.join(', ') || 'Not available'}</span>
									</p>
								{/if}
							</div>

							{#if question.explanation}
								<div class="explanation">
									<strong>Explanation</strong>
									<p>{question.explanation}</p>
								</div>
							{/if}

							<p class="duration">Time: {formatTime(question.durationSeconds)}</p>
						</article>
					{/each}
				</div>
			{/if}
		</section>

		<div class="actions">
			<a href={resolve('/')} class="primary-link">Play Again</a>
			<a href={resolve('/leaderboard')} class="secondary-link">Leaderboard</a>
		</div>
	</div>
</main>

<style>
	.results-card {
		max-width: 800px;
	}

	.results-header {
		margin-bottom: var(--space-lg);
	}

	.results-header h1 {
		margin: 0;
		font-size: clamp(1.8rem, 5vw, 2.5rem);
	}

	.results-header p {
		margin: 0.5rem 0 0;
		color: var(--color-text-muted);
	}

	.summary {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-md);
		margin-bottom: var(--space-xl);
	}

	.summary-item {
		padding: var(--space-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface-muted);
		text-align: center;
	}

	.summary-item span {
		display: block;
		color: var(--color-text-muted);
		font-size: 0.9rem;
		font-weight: 600;
	}

	.summary-item strong {
		display: block;
		margin-top: 0.35rem;
		font-size: 1.5rem;
	}

	.section-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}

	.section-heading h2 {
		margin: 0;
	}

	.section-heading p {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.question-list {
		display: grid;
		gap: var(--space-md);
	}

	.question-result {
		padding: var(--space-lg);
		border: 1px solid var(--color-border);
		border-left: 5px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
	}

	.question-result.correct {
		border-left-color: #16a34a;
	}

	.question-result.wrong {
		border-left-color: #dc2626;
	}

	.question-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
	}

	.question-header h3 {
		margin: 0;
		font-size: 1.1rem;
	}

	.result-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.correct .result-badge {
		background: #dcfce7;
		color: #166534;
	}

	.wrong .result-badge {
		background: var(--color-danger-background);
		color: var(--color-danger);
	}

	.prompt {
		margin: var(--space-md) 0;
		font-size: 1.1rem;
		font-weight: 700;
		line-height: 1.7;
		overflow-wrap: anywhere;
	}

	.answer-section {
		display: grid;
		gap: 0.75rem;
	}

	.answer-section p {
		display: grid;
		gap: 0.25rem;
		margin: 0;
	}

	.answer-section span {
		overflow-wrap: anywhere;
	}

	.correct-answer {
		color: var(--color-text);
	}

	.explanation {
		margin-top: var(--space-md);
		padding: var(--space-md);
		border-radius: var(--radius-sm);
		background: var(--color-primary-soft);
		border: 1px solid var(--color-border-soft);
	}

	.explanation p {
		margin: 0.4rem 0 0;
		overflow-wrap: anywhere;
	}

	.duration {
		margin: var(--space-md) 0 0;
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.actions {
		display: flex;
		gap: var(--space-md);
		margin-top: var(--space-xl);
	}

	.actions a {
		flex: 1;
	}

	.secondary-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.75rem;
		padding: 0.8rem 1rem;
		border-radius: var(--radius-md);
		background: var(--color-surface-muted);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		text-decoration: none;
		font-weight: 700;
	}

	.secondary-link:hover {
		background: var(--color-border);
	}

	@media (max-width: 600px) {
		.results-card {
			padding: var(--space-md);
		}

		.summary {
			grid-template-columns: 1fr;
		}

		.section-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.25rem;
		}

		.question-result {
			padding: var(--space-md);
		}

		.question-header {
			align-items: flex-start;
		}

		.actions {
			flex-direction: column;
		}
	}
</style>
