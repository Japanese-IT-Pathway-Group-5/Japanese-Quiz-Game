<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, Card } from '$lib/components/ui';
</script>

<svelte:head>
	<title>Playwright Demo - Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell">
	<div class="demo-wrapper">
		<Card variant="default">
			<header class="header">
				<i class="fa-solid fa-vial-circle-check header-icon"></i>
				<h1 class="title font-brush text-gold-gradient">Playwright e2e test demo</h1>
			</header>

			<div class="actions">
				<Button href={resolve('/demo')} variant="gold" size="lg" fullWidth>
					<span>Back to Demo</span>
				</Button>
			</div>
		</Card>
	</div>
</div>

<style>
	.demo-wrapper {
		width: min(100%, 520px);
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
		display: grid;
		gap: 0.5rem;
		justify-items: center;
	}

	.header-icon {
		font-size: 2rem;
		color: var(--theme-gold);
	}

	.title {
		margin: 0;
		font-size: clamp(2rem, 4.5vw, 2.75rem);
		font-weight: 900;
		line-height: 1.15;
	}

	.actions {
		display: flex;
		justify-content: center;
	}
</style>
