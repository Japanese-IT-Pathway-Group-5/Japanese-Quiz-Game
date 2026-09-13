<script lang="ts">
	import QuestionCard from '$lib/components/QuestionCard.svelte';

	const sampleQuestion = {
		id: 'demo-q-01',
		format: 'multiple_choice',
		prompt: 'What is the meaning of 「案内する」 (あんないする)?',
		promptJa: '案内する',
		choices: [
			{ id: 'demo-c-01', text: 'To guide / show around' },
			{ id: 'demo-c-02', text: 'To invite' },
			{ id: 'demo-c-03', text: 'To prepare' },
			{ id: 'demo-c-04', text: 'To decide' }
		]
	} as const;
</script>

<main class="page-shell">
	<QuestionCard question={sampleQuestion} />
</main>

<style>
	.page-shell {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%);
	}
</style>
