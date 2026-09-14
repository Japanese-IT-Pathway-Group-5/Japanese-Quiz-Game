<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let {
		class: className = '',
		blinkIntervalMs = 3000,
		blinkImmediately = false
	}: {
		class?: string;
		blinkIntervalMs?: number;
		blinkImmediately?: boolean;
	} = $props();

	type Frame = 'open' | 'half' | 'closed';
	let currentFrame = $state<Frame>('open');
	const timers = new Set<ReturnType<typeof setTimeout>>();
	let isDestroyed = false;

	function schedule(callback: () => void, delay: number) {
		const timer = setTimeout(() => {
			timers.delete(timer);
			callback();
		}, delay);
		timers.add(timer);
	}

	function blink() {
		if (isDestroyed) return;
		currentFrame = 'half';
		schedule(() => {
			if (isDestroyed) return;
			currentFrame = 'closed';
			schedule(() => {
				if (isDestroyed) return;
				currentFrame = 'half';
				schedule(() => {
					if (!isDestroyed) currentFrame = 'open';
				}, 80);
			}, 130);
		}, 80);
	}

	function scheduleBlink() {
		schedule(() => {
			blink();
			scheduleBlink();
		}, blinkIntervalMs);
	}

	onMount(() => {
		if (blinkImmediately) blink();
		scheduleBlink();
	});

	onDestroy(() => {
		isDestroyed = true;
		for (const timer of timers) clearTimeout(timer);
		timers.clear();
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
