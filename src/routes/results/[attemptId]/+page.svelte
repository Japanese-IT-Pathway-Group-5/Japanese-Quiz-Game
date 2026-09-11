<script lang="ts">
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
</style>
