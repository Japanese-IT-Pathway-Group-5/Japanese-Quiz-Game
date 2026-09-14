<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import CloudScenery from '$lib/components/CloudScenery.svelte';
	import { ThemeToggle } from '$lib/components/ui';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-layout">
	<CloudScenery />

	<div class="theme-toggle-floating">
		<ThemeToggle />
	</div>

	<main class="app-main">
		{@render children()}
	</main>
</div>

<style>
	.app-layout {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.theme-toggle-floating {
		position: fixed;
		top: 1.25rem;
		right: 1.5rem;
		z-index: 50;
	}

	.app-main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	@media (max-width: 640px) {
		.theme-toggle-floating {
			top: 0.85rem;
			right: 1rem;
		}
	}
</style>
