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
	.start-card {
		max-width: 640px;
	}

	h1 {
		margin-bottom: 0;
		font-size: clamp(2rem, 8vw, 2.6rem);
		line-height: 1.2;
	}

	.intro {
		margin: 0.75rem 0 1.5rem;
		font-size: 1.05rem;
		color: var(--color-text-muted);
	}

	.start-form {
		display: grid;
		gap: 1rem;
	}

	.field-group {
		display: grid;
		gap: 0.75rem;
	}

	.field-group > .field-label {
		margin: 0;
	}

	.level-option {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		width: 100%;
		padding: 0.85rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface-muted);
		color: var(--color-text);
		cursor: pointer;
	}

	.level-option:hover {
		border-color: var(--color-primary);
		background: var(--color-primary-soft);
	}

	.level-option input {
		width: 1.2rem;
		height: 1.2rem;
		margin: 0;
		accent-color: var(--color-primary);
		flex-shrink: 0;
	}

	.error {
		margin: 0;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		background: var(--color-danger-background);
		border: 1px solid var(--color-danger-border);
		color: var(--color-danger);
		font-weight: 600;
	}

	.quick-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.quick-links a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.75rem;
		padding: 0.7rem 0.9rem;
		border-radius: var(--radius-md);
		background: var(--color-primary-soft);
		border: 1px solid var(--color-border-soft);
		color: var(--color-primary);
		text-decoration: none;
		font-weight: 700;
	}

	.quick-links a:hover {
		background: var(--color-primary);
		color: #ffffff;
	}

	@media (max-width: 480px) {
		.quick-links a {
			flex: 1 1 100%;
		}
	}
</style>
