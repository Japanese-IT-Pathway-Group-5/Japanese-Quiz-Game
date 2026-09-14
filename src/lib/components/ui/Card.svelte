<script lang="ts">
	import type { Snippet } from 'svelte';

	type CardProps = {
		variant?: 'default' | 'paper' | 'double-rule';
		class?: string;
		children?: Snippet;
	};

	let { variant = 'default', class: className = '', children }: CardProps = $props();
</script>

<div class="ui-card ui-card-{variant} {className}">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.ui-card {
		background: color-mix(in srgb, var(--theme-card) 92%, transparent);
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--theme-shadow);
		padding: 2.25rem;
		color: var(--theme-text-main);
		backdrop-filter: blur(12px) saturate(1.2);
		-webkit-backdrop-filter: blur(12px) saturate(1.2);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.ui-card-paper {
		background: var(--theme-paper);
		box-shadow: var(--theme-shadow-sm);
		backdrop-filter: none;
	}

	.ui-card-double-rule {
		background: var(--theme-card);
		border-style: double;
		border-width: 3px;
		border-color: var(--theme-border-strong);
	}

	@media (max-width: 640px) {
		.ui-card {
			padding: 0.9rem;
			border-radius: var(--radius-md);
		}
	}
</style>
