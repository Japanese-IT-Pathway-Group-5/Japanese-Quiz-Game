<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	type ButtonProps = {
		variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		fullWidth?: boolean;
		class?: string;
		children?: Snippet;
		onclick?: (event: MouseEvent) => void;
	} & (HTMLButtonAttributes | HTMLAnchorAttributes);

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		fullWidth = false,
		class: className = '',
		children,
		onclick,
		...rest
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		{href}
		class="ui-btn ui-btn-{variant} ui-btn-{size} {fullWidth ? 'w-full' : ''} {className}"
		{...rest as HTMLAnchorAttributes}
	>
		{#if children}
			{@render children()}
		{/if}
	</a>
{:else}
	<button
		{type}
		{disabled}
		{onclick}
		class="ui-btn ui-btn-{variant} ui-btn-{size} {fullWidth ? 'w-full' : ''} {className}"
		{...rest as HTMLButtonAttributes}
	>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}

<style>
	.ui-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: var(--font-serif);
		font-weight: 700;
		border-radius: var(--radius-md);
		border: 1px solid transparent;
		text-decoration: none;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition:
			transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.2s ease,
			background-color 0.2s ease,
			box-shadow 0.2s ease;
		line-height: 1.25;
		user-select: none;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.18);
	}

	/* Subtle shiny light-sheen sweep across button on hover */
	.ui-btn::after {
		content: '';
		position: absolute;
		top: 0;
		left: -130%;
		width: 70%;
		height: 100%;
		background: linear-gradient(
			105deg,
			transparent 0%,
			rgba(255, 255, 255, 0.28) 50%,
			transparent 100%
		);
		transform: skewX(-22deg);
		transition: left 1.1s cubic-bezier(0.2, 0.8, 0.2, 1);
		pointer-events: none;
		z-index: 1;
	}

	.ui-btn:hover:not(:disabled)::after {
		left: 150%;
	}

	/* Subtle, sleek hover lift */
	.ui-btn:hover:not(:disabled) {
		transform: translateY(-1.5px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.24);
	}

	/* Gentle, subtle press feedback */
	.ui-btn:active:not(:disabled) {
		transform: translateY(0.5px);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
	}

	.w-full {
		width: 100%;
	}

	.ui-btn-sm {
		padding: 0.45rem 0.85rem;
		font-size: 0.875rem;
	}

	.ui-btn-md {
		padding: 0.65rem 1.25rem;
		font-size: 0.95rem;
	}

	.ui-btn-lg {
		padding: 0.8rem 1.5rem;
		font-size: 1.05rem;
	}

	.ui-btn-primary {
		background: var(--theme-primary);
		color: #ffffff;
		border-color: var(--theme-primary);
	}

	.ui-btn-primary:hover:not(:disabled) {
		background: var(--theme-primary-hover);
		filter: brightness(1.05);
	}

	.ui-btn-secondary,
	.ui-btn-gold {
		background: var(--theme-gold-shimmer);
		color: #022659;
		border-color: var(--theme-gold);
		font-weight: 800;
	}

	.ui-btn-secondary::after,
	.ui-btn-gold::after {
		background: linear-gradient(
			105deg,
			transparent 0%,
			rgba(255, 255, 255, 0.42) 50%,
			transparent 100%
		);
	}

	.ui-btn-secondary:hover:not(:disabled),
	.ui-btn-gold:hover:not(:disabled) {
		filter: brightness(1.04);
	}

	.ui-btn-outline,
	.ui-btn-ghost {
		background: var(--theme-paper);
		border-color: var(--theme-border);
		color: var(--theme-text-main);
	}

	.ui-btn-outline:hover:not(:disabled),
	.ui-btn-ghost:hover:not(:disabled) {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		color: #ffffff;
	}

	.ui-btn:focus-visible {
		outline: 2px solid var(--theme-gold);
		outline-offset: 2px;
	}

	.ui-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		transform: none !important;
		box-shadow: none !important;
	}

	@media (max-width: 640px) {
		.ui-btn {
			gap: 0.35rem;
		}

		.ui-btn-sm {
			padding: 0.32rem 0.6rem;
			font-size: 0.7rem;
		}

		.ui-btn-md {
			padding: 0.46rem 0.88rem;
			font-size: 0.76rem;
		}

		.ui-btn-lg {
			padding: 0.56rem 1.05rem;
			font-size: 0.84rem;
		}
	}
</style>
