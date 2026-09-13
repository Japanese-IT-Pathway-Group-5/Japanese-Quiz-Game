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
		color: var(--color-text);
	}

	.text-input {
		width: 100%;
	}

	.text-input:focus-visible {
		outline: 3px solid var(--color-primary);
		outline-offset: 2px;
	}
</style>