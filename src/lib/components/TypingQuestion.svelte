<script lang="ts">
	let { questionId }: { questionId: string } = $props();

	let inputEl: HTMLInputElement | undefined = $state();

	$effect(() => {
		// Re-focus whenever a new question is shown.
		void questionId;
		inputEl?.focus();
	});
</script>

<label class="field-label" for="answer">Your answer</label>
<input
	id="answer"
	class="text-input"
	type="text"
	name="answer"
	bind:this={inputEl}
	autocorrect="off"
	autocapitalize="off"
	autocomplete="off"
	spellcheck="false"
	required
/>

<style>
	.field-label {
		font-size: 0.95rem;
		font-weight: 700;
		color: #1e293b;
	}

	.text-input {
		width: 100%;
		padding: 0.85rem 1rem;
		border: 2px solid #cbd5e1;
		border-radius: 0.8rem;
		font-size: 1rem;
		background: white;
	}

	.text-input:focus-visible {
		outline: 3px solid #2563eb;
		outline-offset: 2px;
	}
</style>
