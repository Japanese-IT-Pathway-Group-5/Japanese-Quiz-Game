<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import CloudScenery from '$lib/components/CloudScenery.svelte';
	import { ThemeToggle } from '$lib/components/ui';
	import { onMount } from 'svelte';
	import { initBackgroundMusic } from '$lib/audio/backgroundMusic';
	import { playClickSound } from '$lib/audio/clickSound';

	let { children } = $props();

	function handleGlobalClick(event: MouseEvent) {
		const target = event.target as HTMLElement | null;
		if (!target) return;

		const clickable = target.closest(
			'button, a, [role="button"], .ui-btn, input[type="submit"], input[type="button"]'
		);
		if (clickable) {
			playClickSound();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleGlobalClick);
		initBackgroundMusic();

		return () => {
			document.removeEventListener('click', handleGlobalClick);
		};
	});
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

	@media (max-width: 768px) {
		:global(body:has(.quiz-page-shell)) .theme-toggle-floating,
		:global(body:has(.review-page-shell)) .theme-toggle-floating {
			top: 0.65rem;
			right: 0.75rem;
			z-index: 50;
		}
	}
</style>
