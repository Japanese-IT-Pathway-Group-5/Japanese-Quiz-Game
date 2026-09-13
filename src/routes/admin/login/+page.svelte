<script lang="ts">
	import type { ActionData } from './$types';
	import { Button, Card } from '$lib/components/ui';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin Login - Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell">
	<div class="login-wrapper">
		<Card variant="default">
			<header class="header">
				<i class="fa-solid fa-lock header-icon"></i>
				<h1 class="title font-brush text-gold-gradient">Admin Login</h1>
			</header>

			<form method="POST" class="login-form">
				<div class="field">
					<label class="field-label" for="password">Password</label>
					<input
						id="password"
						class="input-text"
						name="password"
						type="password"
						autocomplete="current-password"
						placeholder="Enter password"
						required
					/>
				</div>

				{#if form?.error}
					<div class="error-banner" role="alert">
						<span>{form.error}</span>
					</div>
				{/if}

				<Button type="submit" variant="primary" size="lg" fullWidth>
					<span>Log in</span>
					<span>-></span>
				</Button>
			</form>
		</Card>
	</div>
</div>

<style>
	.login-wrapper {
		width: min(100%, 420px);
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
		display: grid;
		gap: 0.5rem;
		justify-items: center;
	}

	.header-icon {
		font-size: 2rem;
		color: var(--theme-gold);
	}

	.title {
		margin: 0;
		font-size: clamp(2.2rem, 5vw, 2.75rem);
		font-weight: 900;
		line-height: 1.15;
	}

	.login-form,
	.field {
		display: grid;
		gap: 1rem;
	}

	.field {
		gap: 0.5rem;
	}

	.field-label {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--theme-text-main);
	}

	.error-banner {
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		background: var(--theme-error-bg);
		border: 1px solid var(--theme-error);
		color: var(--theme-error);
		font-size: 0.88rem;
		font-weight: 600;
	}
</style>
