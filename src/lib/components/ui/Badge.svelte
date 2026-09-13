<script lang="ts">
	import type { Snippet } from 'svelte';

	type BadgeProps = {
		variant?: 'stamp' | 'gold' | 'blue' | 'green' | 'pill';
		class?: string;
		children?: Snippet;
	};

	let { variant = 'stamp', class: className = '', children }: BadgeProps = $props();
</script>

<span class="ui-badge ui-badge-{variant} {className}">
	{#if children}
		{@render children()}
	{/if}
</span>

<style>
	.ui-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		font-family: var(--font-mono);
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		user-select: none;
	}

	/* Hanko style stamp badges */
	.ui-badge-stamp {
		padding: 0.2rem 0.6rem;
		font-size: 0.72rem;
		border: 1.5px solid var(--theme-primary);
		color: var(--theme-primary);
		border-radius: var(--radius-sm);
		transform: rotate(-1.5deg);
	}

	.ui-badge-gold {
		padding: 0.2rem 0.6rem;
		font-size: 0.72rem;
		border: 1.5px solid var(--theme-accent);
		color: var(--theme-accent);
		border-radius: var(--radius-sm);
		transform: rotate(-1deg);
	}

	.ui-badge-blue {
		padding: 0.2rem 0.6rem;
		font-size: 0.72rem;
		border: 1.5px solid var(--theme-secondary);
		color: var(--theme-secondary);
		border-radius: var(--radius-sm);
		transform: rotate(1deg);
	}

	.ui-badge-green {
		padding: 0.2rem 0.6rem;
		font-size: 0.72rem;
		border: 1.5px solid var(--theme-success);
		color: var(--theme-success);
		border-radius: var(--radius-sm);
	}

	.ui-badge-pill {
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		border-radius: var(--radius-pill);
		background: rgba(128, 128, 128, 0.12);
		color: var(--theme-text-main);
	}
</style>
