<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Credits</title>
</svelte:head>

<main class="page-shell">
	<div class="info-card">
		<h1>Credits</h1>

		<p>This page will list the team members and their contributions.</p>

		<a href={resolve('/')}>Back to start</a>
	</div>
</main>

<style>
	.info-card {
		max-width: 560px;
	}

	.info-card a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.75rem;
		margin-top: 1rem;
		padding: 0.8rem 1rem;
		border-radius: var(--radius-md);
		background: var(--color-primary);
		color: #ffffff;
		text-decoration: none;
		font-weight: 700;
	}

	.info-card a:hover {
		background: var(--color-primary-hover);
	}
</style>