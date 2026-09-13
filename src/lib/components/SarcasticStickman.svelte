<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<div class="stickman-anim {className}" aria-hidden="true">
	<div class="stickman-stack">
		<img
			src="/images/stickman-open.webp"
			alt="Sarcastic stickman"
			class="stickman-frame frame-open"
			draggable="false"
			loading="eager"
		/>
		<img
			src="/images/stickman-half.webp"
			alt=""
			class="stickman-frame frame-half"
			draggable="false"
			loading="eager"
		/>
		<img
			src="/images/stickman-closed.webp"
			alt=""
			class="stickman-frame frame-closed"
			draggable="false"
			loading="eager"
		/>
	</div>
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
	}

	.stickman-stack {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.stickman-frame {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
	}

	/* Base open frame remains continuously solid (no blank/white flashes) */
	.frame-open {
		opacity: 1;
	}

	/* Eyelid overlay frames step on top smoothly */
	.frame-half {
		opacity: 0;
		animation: blink-half 3.2s infinite step-end;
	}

	.frame-closed {
		opacity: 0;
		animation: blink-closed 3.2s infinite step-end;
	}

	@keyframes blink-half {
		0%,
		89%,
		96%,
		100% {
			opacity: 0;
		}
		90%,
		95% {
			opacity: 1;
		}
	}

	@keyframes blink-closed {
		0%,
		90%,
		95%,
		100% {
			opacity: 0;
		}
		91%,
		92%,
		93%,
		94% {
			opacity: 1;
		}
	}
</style>
