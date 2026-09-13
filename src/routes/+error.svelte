<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui';
	import SarcasticStickman from '$lib/components/SarcasticStickman.svelte';
</script>

<svelte:head>
	<title>Page Not Found · Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell">
	<div class="error-canvas">
		<SarcasticStickman class="error-stickman" />

		<h1 class="error-code font-brush text-gold-gradient">
			{page.status}
		</h1>

		<p class="error-msg font-mono">
			{page.error?.message || 'The page or game session you requested does not exist.'}
		</p>

		<div class="error-actions">
			<Button href={resolve('/')} variant="primary" size="lg" fullWidth>
				<i class="fa-solid fa-house"></i>
				<span>Return to Home</span>
			</Button>
		</div>
	</div>
</div>

<style>
	.page-shell {
		min-height: 100vh;
		padding: 3rem 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.error-canvas {
		width: min(100%, 480px);
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.error-canvas :global(.error-stickman) {
		width: 150px;
		height: 150px;
	}

	.error-code {
		margin: 0;
		font-size: clamp(3.5rem, 8vw, 5rem);
		font-weight: 900;
		line-height: 1;
		filter: drop-shadow(0 4px 18px rgba(0, 15, 45, 0.45));
	}

	.error-msg {
		margin: 0;
		font-size: 1rem;
		color: var(--theme-text-muted);
		max-width: 400px;
		line-height: 1.5;
	}

	.error-actions {
		width: 100%;
		max-width: 280px;
		margin-top: 0.5rem;
	}
</style>
