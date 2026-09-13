<script lang="ts">
	interface Props {
		variant?: 'text' | 'title' | 'circle' | 'card' | 'button' | 'chip' | 'choice' | 'custom';
		width?: string;
		height?: string;
		borderRadius?: string;
		count?: number;
		class?: string;
	}

	let {
		variant = 'text',
		width,
		height,
		borderRadius,
		count = 1,
		class: className = ''
	}: Props = $props();
</script>

{#if count > 1 && variant === 'text'}
	<div class="skeleton-stack {className}">
		{#each Array.from({ length: count }, (_, i) => i) as idx (idx)}
			<div
				class="skeleton skeleton-text"
				style:width={idx === count - 1 ? '70%' : (width ?? '100%')}
				style:height={height ?? '1.1rem'}
				style:border-radius={borderRadius}
			></div>
		{/each}
	</div>
{:else}
	<div
		class="skeleton skeleton-{variant} {className}"
		style:width
		style:height
		style:border-radius={borderRadius}
	></div>
{/if}

<style>
	.skeleton-stack {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
	}
</style>
