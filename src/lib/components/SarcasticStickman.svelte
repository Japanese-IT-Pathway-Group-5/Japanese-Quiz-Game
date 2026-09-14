<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { class: className = '' }: { class?: string } = $props();

	type Frame = 'open' | 'half' | 'closed';
	let currentFrame = $state<Frame>('open');
	let timer: ReturnType<typeof setTimeout> | null = null;
	let isDestroyed = false;

	function scheduleBlink() {
		if (isDestroyed) return;
		timer = setTimeout(() => {
			if (isDestroyed) return;
			currentFrame = 'half';
			setTimeout(() => {
				if (isDestroyed) return;
				currentFrame = 'closed';
				setTimeout(() => {
					if (isDestroyed) return;
					currentFrame = 'half';
					setTimeout(() => {
						if (isDestroyed) return;
						currentFrame = 'open';
						scheduleBlink();
					}, 80);
				}, 130);
			}, 80);
		}, 3000);
	}

	onMount(() => {
		scheduleBlink();
	});

	onDestroy(() => {
		isDestroyed = true;
		if (timer) clearTimeout(timer);
	});
</script>

<div class="stickman-anim {className}" aria-hidden="true">
	<img
		src={`/images/stickman-${currentFrame}.webp`}
		alt="Sarcastic stickman"
		class="stickman-img"
		draggable="false"
		loading="eager"
	/>
</div>

<style>
	.stickman-anim {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 160px;
		height: 160px;
		margin: 0 auto;
		padding: 1rem;
		border: none;
		border-radius: 50%;
		background: #ffffff;
		user-select: none;
		overflow: hidden;
	}

	.stickman-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
	}
</style>
