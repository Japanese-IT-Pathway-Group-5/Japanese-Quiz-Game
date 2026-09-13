<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<div class="stickman-anim {className}" aria-hidden="true">
	<img
		src="/images/sacarstic-stickman-animated.svg"
		alt="Sarcastic stickman blinking"
		class="stickman-img"
		draggable="false"
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
	}

	.stickman-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
	}
</style>
