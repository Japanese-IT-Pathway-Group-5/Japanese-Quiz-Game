<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui';

	let { data }: { data: PageData } = $props();
	const attempt = $derived(data.attempt);
	const questionResults = $derived(data.questionResults ?? []);

	const totalQuestions = $derived(questionResults.length || (attempt.chosenQuestions ?? []).length);
	const accuracy = $derived(
		totalQuestions > 0 ? Math.round((attempt.correctCount / totalQuestions) * 100) : 0
	);
	const finalScore = $derived(attempt.finalScore ?? attempt.correctCount);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};
</script>

<svelte:head>
	<title>Results · 結果 · Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell">
	<div class="results-canvas">
		<header class="header">
			<h1 class="title font-brush text-gold-gradient">結果発表</h1>
		</header>

		<!-- Main Score Display -->
		<div class="score-showcase">
			<div class="score-badge-container">
				<span class="score-label font-mono">FINAL SCORE</span>
				<div class="score-number font-brush text-gold-gradient">{finalScore}</div>
				<span class="score-pts font-mono">/ 100 PTS</span>
			</div>

			<div class="stats-grid">
				<div class="stat-item">
					<span class="stat-label">Correct</span>
					<span class="stat-value font-mono">
						{attempt.correctCount} <span class="stat-sub">/ {totalQuestions}</span>
					</span>
				</div>

				<div class="stat-item">
					<span class="stat-label">Accuracy</span>
					<span class="stat-value font-mono">{accuracy}%</span>
				</div>

				<div class="stat-item">
					<span class="stat-label">Time</span>
					<span class="stat-value font-mono">{formatTime(data.timeTaken ?? 0)}</span>
				</div>

				<div class="stat-item">
					<span class="stat-label">Level</span>
					<span class="stat-value font-japanese">{attempt.level}</span>
				</div>
			</div>
		</div>

		<!-- Question Review -->
		{#if questionResults.length > 0}
			<section class="questions-section">
				<h2 class="questions-title">Question Review</h2>

				<div class="questions-list">
					{#each questionResults as question, index (question.questionId)}
						<article
							class="question-card"
							class:correct={question.isCorrect}
							class:wrong={!question.isCorrect}
						>
							<div class="question-header">
								<span class="q-badge font-mono">Q{index + 1}</span>
								<span class="result-badge" class:is-correct={question.isCorrect}>
									{#if question.isCorrect}
										<i class="fa-solid fa-check"></i> Correct
									{:else}
										<i class="fa-solid fa-xmark"></i> Incorrect
									{/if}
								</span>
							</div>

							<p class="prompt">{question.prompt}</p>

							<div class="answer-details">
								<p class="ans-row">
									<span class="ans-label">Your answer:</span>
									<span class="ans-text" class:ans-wrong={!question.isCorrect}
										>{question.answer || 'No answer'}</span
									>
								</p>

								{#if !question.isCorrect}
									<p class="ans-row">
										<span class="ans-label">Correct answer:</span>
										<span class="ans-text ans-correct"
											>{question.correctAnswers.join(', ') || 'Not available'}</span
										>
									</p>
								{/if}
							</div>

							{#if question.explanation}
								<div class="explanation">
									<strong>Explanation</strong>
									<p>{question.explanation}</p>
								</div>
							{/if}

							<div class="duration font-mono">
								Time: {formatTime(question.durationSeconds)}
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Actions -->
		<div class="results-actions">
			<Button href={resolve('/')} variant="primary" size="lg" fullWidth>
				<span>Play Again</span>
			</Button>

			<Button href={resolve('/leaderboard')} variant="gold" size="md" fullWidth>
				<span>View Leaderboard</span>
			</Button>
		</div>
	</div>
</div>

<style>
	.page-shell {
		min-height: 100vh;
		padding: 2.5rem 1rem;
		display: flex;
		justify-content: center;
	}

	.results-canvas {
		width: min(100%, 640px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.header {
		text-align: center;
		padding: 0.5rem 0;
	}

	.title {
		margin: 0;
		font-size: clamp(2.4rem, 6vw, 3.2rem);
		font-weight: 900;
		letter-spacing: 0.06em;
		filter: drop-shadow(0 4px 18px rgba(0, 15, 45, 0.45));
	}

	.score-showcase {
		padding: 1.5rem;
		display: grid;
		gap: 1.5rem;
		text-align: center;
		border-radius: var(--radius-lg, 1rem);
		background: rgba(0, 15, 45, 0.6);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}

	.score-badge-container {
		display: grid;
		gap: 0.2rem;
		justify-items: center;
	}

	.score-label {
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		color: var(--theme-gold, #ffbc0d);
		font-weight: 700;
	}

	.score-number {
		font-size: 3.8rem;
		font-weight: 900;
		line-height: 1;
		filter: drop-shadow(0 2px 10px rgba(255, 188, 13, 0.35));
	}

	.score-pts {
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		color: var(--theme-text-muted, #94a3b8);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
	}

	.stat-item {
		display: grid;
		gap: 0.2rem;
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--theme-text-muted, #94a3b8);
	}

	.stat-value {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--theme-text-main, #ffffff);
	}

	.stat-sub {
		font-size: 0.8rem;
		font-weight: normal;
		color: var(--theme-text-muted, #94a3b8);
	}

	/* Question Review */
	.questions-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.questions-title {
		margin: 0;
		font-size: 1.25rem;
		color: var(--theme-text-main, #ffffff);
		font-weight: 700;
	}

	.questions-list {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.question-card {
		padding: 1.25rem;
		border-radius: var(--radius-md, 0.75rem);
		background: rgba(0, 15, 45, 0.5);
		backdrop-filter: blur(8px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		border-left-width: 4px;
	}

	.question-card.correct {
		border-left-color: #22c55e;
	}

	.question-card.wrong {
		border-left-color: #ef4444;
	}

	.question-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.q-badge {
		font-size: 0.8rem;
		font-weight: 800;
		color: var(--theme-text-muted, #94a3b8);
	}

	.result-badge {
		font-size: 0.8rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		color: #ef4444;
	}

	.result-badge.is-correct {
		color: #22c55e;
	}

	.prompt {
		margin: 0 0 0.85rem;
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--theme-text-main, #ffffff);
		line-height: 1.4;
	}

	.answer-details {
		display: grid;
		gap: 0.35rem;
		font-size: 0.95rem;
	}

	.ans-row {
		margin: 0;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.ans-label {
		color: var(--theme-text-muted, #94a3b8);
	}

	.ans-text {
		color: var(--theme-text-main, #ffffff);
		font-weight: 600;
	}

	.ans-wrong {
		color: #fca5a5;
		text-decoration: line-through;
	}

	.ans-correct {
		color: #86efac;
	}

	.explanation {
		margin-top: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-sm, 0.5rem);
		background: rgba(255, 255, 255, 0.04);
		border-left: 2px solid var(--theme-gold, #ffbc0d);
		font-size: 0.88rem;
		color: var(--theme-text-muted, #cbd5e1);
	}

	.explanation strong {
		display: block;
		margin-bottom: 0.25rem;
		color: var(--theme-gold, #ffbc0d);
	}

	.explanation p {
		margin: 0;
		line-height: 1.4;
	}

	.duration {
		margin-top: 0.75rem;
		font-size: 0.78rem;
		color: var(--theme-text-muted, #94a3b8);
	}

	.results-actions {
		display: grid;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	@media (max-width: 600px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
	}
</style>
