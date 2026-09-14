<script lang="ts">
	let {
		startedAt
	}: {
		startedAt: Date;
	} = $props();

	let elapsedSeconds = $state(0);

	function updateTimer() {
		// Calculate elapsed time strictly from the DB timestamp to survive page reloads
		const diff = Date.now() - startedAt.getTime();
		elapsedSeconds = Math.max(0, Math.floor(diff / 1000));
	}

	$effect(() => {
		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	});

	const formattedTime = $derived.by(() => {
		const mins = Math.floor(elapsedSeconds / 60);
		const secs = elapsedSeconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	});
</script>

<div class="timer" aria-live="polite">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="timer-icon"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="10"></circle>
		<polyline points="12 6 12 12 16 14"></polyline>
	</svg>
	<span class="timer-text">{formattedTime}</span>
</div>

<style>
	.timer {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #f1f5f9;
		padding: 0.5rem 0.85rem;
		border-radius: 9999px;
		color: #334155;
	}

	.timer-icon {
		color: #64748b;
	}

	.timer-text {
		font-variant-numeric: tabular-nums;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-weight: 700;
		font-size: 1.05rem;
		letter-spacing: -0.02em;
	}

	@media (max-width: 640px) {
		.timer {
			gap: 0.3rem;
			padding: 0.32rem 0.55rem;
		}

		.timer-icon {
			width: 14px;
			height: 14px;
		}

		.timer-text {
			font-size: 0.76rem;
		}
	}
</style>
