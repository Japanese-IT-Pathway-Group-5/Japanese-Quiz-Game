<script lang="ts">
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';

	let {
		class: className = '',
		src = '/animations/account-save.lottie',
		size = 140
	}: {
		class?: string;
		src?: string;
		size?: number;
	} = $props();
</script>

<div
	class="save-animation-wrap {className}"
	style="width: {size}px; height: {size}px;"
	aria-hidden="true"
>
	<DotLottieSvelte {src} autoplay={true} loop={true} />
</div>

<style>
	.save-animation-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		user-select: none;
		pointer-events: none;
	}

	.save-animation-wrap :global(canvas),
	.save-animation-wrap :global(dotlottie-player),
	.save-animation-wrap :global(.dotlottie-container) {
		width: 100% !important;
		height: 100% !important;
	}
</style>
