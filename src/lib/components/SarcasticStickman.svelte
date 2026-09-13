<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<div class="stickman-anim {className}" aria-hidden="true">
	<div class="stickman-stack">
		<img
			src="/images/stickman-open.png"
			alt="Sarcastic stickman"
			class="stickman-frame frame-open"
			draggable="false"
			loading="eager"
		/>
		<img
			src="/images/stickman-half.png"
			alt=""
			class="stickman-frame frame-half"
			draggable="false"
			loading="eager"
		/>
		<img
			src="/images/stickman-closed.png"
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

	.frame-open {
		opacity: 1;
		animation: blink-open 2.6s infinite step-end;
	}

	.frame-half {
		opacity: 0;
		animation: blink-half 2.6s infinite step-end;
	}

	.frame-closed {
		opacity: 0;
		animation: blink-closed 2.6s infinite step-end;
	}

	@keyframes blink-open {
		0%,
		86%,
		100% {
			opacity: 1;
		}
		87%,
		95% {
			opacity: 0;
		}
	}

	@keyframes blink-half {
		0%,
		86%,
		96%,
		100% {
			opacity: 0;
		}
		87%,
		88%,
		93%,
		95% {
			opacity: 1;
		}
	}

	@keyframes blink-closed {
		0%,
		88%,
		94%,
		100% {
			opacity: 0;
		}
		89%,
		93% {
			opacity: 1;
		}
	}
</style>
