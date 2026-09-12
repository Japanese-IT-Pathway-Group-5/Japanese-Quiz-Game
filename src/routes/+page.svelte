<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const nickname = $derived(form?.nickname ?? data.nickname ?? '');
	const level = $derived(form?.level ?? 'N4');
</script>

<svelte:head>
	<title>Japanese Quiz Game</title>
</svelte:head>

<main class="page-shell">
	<div class="start-card">
		<h1>Japanese Quiz Game</h1>
		<p class="intro">Test your JLPT vocabulary and grammar with a quick, timed quiz.</p>

		<form method="POST" class="start-form">
			<label class="field-label" for="nickname">Nickname</label>
			<input
				id="nickname"
				name="nickname"
				type="text"
				maxlength="30"
				value={nickname}
				autocomplete="nickname"
				required
			/>

			<div class="field-group" role="radiogroup" aria-label="Choose quiz level">
				<p class="field-label">Choose a level</p>
				<label class="level-option">
					<input type="radio" name="level" value="N4" checked={level === 'N4'} />
					<span>N4</span>
				</label>
				<label class="level-option">
					<input type="radio" name="level" value="N3" checked={level === 'N3'} />
					<span>N3</span>
				</label>
			</div>

			<button type="submit" class="start-button">Start</button>

			{#if form?.error}
				<p class="error" role="alert">{form.error}</p>
			{/if}
		</form>

		<nav class="quick-links" aria-label="Quick links">
			<a href={resolve('/leaderboard')}>Leaderboard</a>
			<a href={resolve('/credits')}>Credits</a>
		</nav>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
		background: linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%);
	}

	.page-shell {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.start-card {
		width: min(100%, 640px);
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid #dbeafe;
		border-radius: 1rem;
		box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
		padding: 2rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 4vw, 2.6rem);
	}

	.intro {
		margin: 0.75rem 0 1.5rem;
		font-size: 1.05rem;
		color: #475569;
	}

	.start-form {
		display: grid;
		gap: 1rem;
	}

	.field-label {
		font-size: 0.95rem;
		font-weight: 700;
		color: #1e293b;
	}

	input[type='text'] {
		width: 100%;
		padding: 0.85rem 1rem;
		border: 2px solid #cbd5e1;
		border-radius: 0.8rem;
		font-size: 1rem;
		box-sizing: border-box;
	}

	.field-group {
		display: grid;
		gap: 0.75rem;
	}

	.level-option {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.85rem 1rem;
		border: 2px solid #cbd5e1;
		border-radius: 0.8rem;
		background: #f8fafc;
	}

	.level-option input {
		transform: scale(1.2);
	}

	.start-button {
		padding: 0.9rem 1.1rem;
		border: 0;
		border-radius: 0.8rem;
		background: #2563eb;
		color: white;
		font-size: 1rem;
		font-weight: 700;
		cursor: pointer;
	}

	.error {
		margin: 0;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #b91c1c;
		font-weight: 600;
	}

	.quick-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.quick-links a {
		display: inline-block;
		padding: 0.7rem 0.9rem;
		border-radius: 0.75rem;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		color: #1d4ed8;
		text-decoration: none;
		font-weight: 700;
	}
</style>
