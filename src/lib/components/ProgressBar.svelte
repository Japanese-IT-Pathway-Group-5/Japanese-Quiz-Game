<script lang="ts">
	let {
		current,
		total
	}: {
		current: number;
		total: number;
	} = $props();
</script>

<div class="progress-container">
	<span class="progress-text" aria-live="polite">
		Question {current} of {total}
	</span>
	<progress class="progress-bar" value={current} max={total}>
		{current} / {total}
	</progress>
</div>

<style>
	.progress-container {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.progress-text {
		font-size: 0.95rem;
		color: #475569;
		font-weight: 600;
	}

	.progress-bar {
		width: 100%;
		height: 0.75rem;
		border-radius: 9999px;
		overflow: hidden;
		appearance: none;
		-webkit-appearance: none;
		border: none;
		background-color: #e2e8f0;
	}

	.progress-bar::-webkit-progress-bar {
		background-color: #e2e8f0;
	}

	.progress-bar::-webkit-progress-value {
		background-color: #2563eb;
		transition: width 0.3s ease;
	}

	.progress-bar::-moz-progress-bar {
		background-color: #2563eb;
		transition: width 0.3s ease;
	}

	@media (max-width: 640px) {
		.progress-container {
			gap: 0.2rem;
		}

		.progress-text {
			font-size: 0.7rem;
		}

		.progress-bar {
			height: 0.5rem;
		}
	}
</style>
