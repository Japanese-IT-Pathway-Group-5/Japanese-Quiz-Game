<!-- <script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const attempt = $derived(data.attempt);
</script>

<svelte:head>
	<title>Results</title>
</svelte:head>

<main class="page-shell">
	<div class="results-card">
		<h1>Results</h1>
		<p class="score-line">
			You scored <strong>{attempt.correctCount}</strong> out of
			<strong>{attempt.chosenQuestions.length}</strong>
		</p>
		<p class="score-line">
			Final score: <strong>{attempt.finalScore ?? attempt.correctCount}</strong>
		</p>
		<a href={resolve('/')} class="primary-link">Back to home</a>
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
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.results-card {
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid #dbeafe;
		border-radius: 1rem;
		box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
		padding: 2rem;
		width: min(100%, 560px);
	}

	h1 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.score-line {
		font-size: 1.1rem;
		margin: 0.5rem 0;
	}

	.primary-link {
		display: inline-block;
		margin-top: 1rem;
		padding: 0.8rem 1rem;
		border-radius: 0.75rem;
		background: #2563eb;
		color: white;
		text-decoration: none;
		font-weight: 700;
	}
</style> -->
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
		<h1>Quiz Results</h1>

		<section class="summary">
			<div>
				<span>Score</span>
				<strong>{attempt.finalScore ?? 0}</strong>
			</div>

			<div>
				<span>Correct</span>
				<strong>{attempt.correctCount} / {attempt.chosenQuestions.length}</strong>
			</div>

			<div>
				<span>Time</span>
				<strong>{formatTime(data.timeTaken)}</strong>
			</div>
		</section>

		<section class="questions">
			<h2>Question Review</h2>

			{#each questionResults as question, index (question.questionId)}
				<article class:correct={question.isCorrect} class:wrong={!question.isCorrect}>
					<div class="question-header">
						<h3>Question {index + 1}</h3>

						<span class="result">
							{question.isCorrect ? 'Correct' : 'Wrong'}
						</span>
					</div>

					<p class="prompt">{question.prompt}</p>

					<p>
						<strong>Your answer:</strong>
						{question.answer || 'No answer'}
					</p>

					{#if !question.isCorrect}
						<p>
							<strong>Correct answer:</strong>
							{question.correctAnswers.join(', ') || 'Not available'}
						</p>
					{/if}

					{#if question.explanation}
						<div class="explanation">
							<strong>Explanation</strong>
							<p>{question.explanation}</p>
						</div>
					{/if}

					<p class="duration">
						Time: {formatTime(question.durationSeconds)}
					</p>
				</article>
			{/each}
		</section>

		<div class="actions">
			<a href={resolve('/')} class="primary-link">Play Again</a>
			<a href={resolve('/leaderboard')} class="secondary-link">Leaderboard</a>
		</div>
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
		padding: 2rem 1rem;
	}

	.results-card {
		width: min(100%, 800px);
		margin: 0 auto;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
		padding: 2rem;
	}

	h1 {
		margin-top: 0;
	}

	.summary {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin: 1.5rem 0 2rem;
	}

	.summary div {
		padding: 1rem;
		border-radius: 0.75rem;
		background: #f8fafc;
		text-align: center;
	}

	.summary span {
		display: block;
		color: #64748b;
		font-size: 0.9rem;
	}

	.summary strong {
		display: block;
		margin-top: 0.35rem;
		font-size: 1.4rem;
	}

	.questions h2 {
		margin-bottom: 1rem;
	}

	article {
		margin-bottom: 1rem;
		padding: 1.25rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
	}

	article.correct {
		border-left: 5px solid #16a34a;
	}

	article.wrong {
		border-left: 5px solid #dc2626;
	}

	.question-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	h3 {
		margin: 0;
	}

	.result {
		font-weight: 700;
	}

	.correct .result {
		color: #16a34a;
	}

	.wrong .result {
		color: #dc2626;
	}

	.prompt {
		font-size: 1.05rem;
		font-weight: 600;
	}

	.explanation {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
		background: #f8fafc;
	}

	.explanation p {
		margin-bottom: 0;
	}

	.duration {
		color: #64748b;
		font-size: 0.9rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.actions a {
		flex: 1;
		padding: 0.85rem 1rem;
		border-radius: 0.75rem;
		text-align: center;
		font-weight: 700;
		text-decoration: none;
	}

	.primary-link {
		background: #2563eb;
		color: white;
	}

	.secondary-link {
		background: #e2e8f0;
		color: #1e293b;
	}

	@media (max-width: 600px) {
		.results-card {
			padding: 1.25rem;
		}

		.summary {
			grid-template-columns: 1fr;
		}

		.actions {
			flex-direction: column;
		}
	}
</style>
