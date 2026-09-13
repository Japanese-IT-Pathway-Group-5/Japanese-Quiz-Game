<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, Card } from '$lib/components/ui';
</script>

<svelte:head>
	<title>Admin - Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell">
	<div class="admin-wrapper">
		<Card variant="default">
			<header class="header">
				<i class="fa-solid fa-screwdriver-wrench header-icon"></i>
				<h1 class="title font-brush text-gold-gradient">Admin</h1>
			</header>

			<form method="POST" action={resolve('/admin/logout')} class="actions">
				<Button type="submit" variant="gold" size="lg" fullWidth>
					<span>Log out</span>
				</Button>
			</form>
		</Card>
	</div>
</div>

<style>
	.admin-wrapper {
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

	.actions {
		display: flex;
		justify-content: center;
	}
</style>
