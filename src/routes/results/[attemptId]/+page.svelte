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
	.results-card {
		max-width: 560px;
	}

	h1 {
		margin-bottom: 1rem;
	}

	.score-line {
		margin: 0.5rem 0;
		font-size: 1.1rem;
	}

	.results-card .primary-link {
		margin-top: 1rem;
	}
</style>