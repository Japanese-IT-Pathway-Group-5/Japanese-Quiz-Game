<script lang="ts">
	import { resolve } from '$app/paths';
	import { teamMembers } from '$lib/credits';
	import TeamPhoto from '$lib/components/TeamPhoto.svelte';
	import { Button } from '$lib/components/ui';

	let activeMemberId: string | null = $state(null);

	let activeMember = $derived(teamMembers.find((m) => m.id === activeMemberId) || null);
</script>

<svelte:head>
	<title>Credits · 制作チーム · Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell">
	<div class="credits-canvas">
		<header class="header">
			<h1 class="title font-brush text-gold-gradient">開発チーム紹介</h1>
			<p class="subtitle font-mono">GROUP 5</p>
		</header>

		<!-- Main Two-Column Side-by-Side Area -->
		<main class="credits-main">
			<!-- Left Column: Interactive Team Photo -->
			<div class="photo-column">
				<TeamPhoto
					members={teamMembers}
					bind:activeMemberId
					onselect={(id) => (activeMemberId = id)}
				/>
			</div>

			<!-- Right Column: Member Details Side Panel -->
			<aside class="side-panel" aria-live="polite">
				{#if activeMember}
					<div class="panel-content active-view">
						<div class="panel-header">
							<div class="panel-identity">
								<span class="panel-jp-tag font-japanese"
									>{activeMember.katakanaName || activeMember.name}</span
								>
								<h2 class="panel-name">{activeMember.name}</h2>
								<span class="panel-role font-mono">{activeMember.role}</span>
							</div>
						</div>

						<div class="panel-divider"></div>

						<div class="panel-contributions">
							<h3 class="panel-section-title font-mono">
								<i class="fa-solid fa-code"></i> CONTRIBUTIONS
							</h3>
							<ul class="contributions-list">
								{#each activeMember.contributions as contribution (contribution)}
									<li>{contribution}</li>
								{/each}
							</ul>
						</div>
					</div>
				{:else}
					<div class="panel-content placeholder-view">
						<i class="fa-solid fa-users placeholder-icon"></i>
						<h2 class="placeholder-title font-brush text-gold-gradient">メンバーを選択</h2>
						<p class="placeholder-text">
							Hover over any member in the group photo to view their role and contributions.
						</p>
					</div>
				{/if}
			</aside>
		</main>

		<footer class="actions">
			<Button href={resolve('/')} variant="gold" size="md">
				<i class="fa-solid fa-house"></i>
				<span>Back to Home</span>
			</Button>
		</footer>
	</div>
</div>

<style>
	.page-shell {
		min-height: 100dvh;
		padding: 1.5rem 1rem 2.5rem 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.credits-canvas {
		width: min(100%, 1120px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.header {
		text-align: center;
		display: grid;
		gap: 0.15rem;
		justify-items: center;
	}

	.title {
		margin: 0;
		font-size: clamp(2rem, 5vw, 2.6rem);
		font-weight: 900;
		letter-spacing: 0.06em;
		filter: drop-shadow(0 4px 16px rgba(0, 15, 45, 0.5));
		line-height: 1.15;
	}

	.subtitle {
		margin: 0;
		font-size: 0.82rem;
		letter-spacing: 0.16em;
		color: #ffffff;
		opacity: 0.9;
		font-weight: 700;
	}

	/* Two-column layout */
	.credits-main {
		display: grid;
		grid-template-columns: 1.18fr 0.82fr;
		gap: 1.5rem;
		align-items: center;
	}

	.photo-column {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	/* Side panel (no container box) */
	.side-panel {
		width: 100%;
		min-height: 360px;
		display: flex;
		padding: 0.5rem 0.25rem;
	}

	.panel-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		transition: opacity 0.25s ease;
	}

	.panel-header {
		display: flex;
		align-items: center;
	}

	.panel-identity {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	/* Pure typographic Japanese role */
	.panel-jp-tag {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--theme-gold, #ffbc0d);
		letter-spacing: 0.05em;
	}

	.panel-name {
		margin: 0;
		font-size: 1.45rem;
		font-weight: 800;
		color: var(--theme-text-main, #ffffff);
		letter-spacing: 0.01em;
		line-height: 1.2;
	}

	.panel-role {
		font-size: 0.82rem;
		color: var(--theme-text-muted, #94a3b8);
		font-weight: 600;
	}

	.panel-divider {
		height: 1px;
		background: linear-gradient(
			90deg,
			rgba(255, 188, 13, 0.5),
			rgba(255, 255, 255, 0.1),
			transparent
		);
	}

	.panel-contributions {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.panel-section-title {
		margin: 0;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		color: var(--theme-gold, #ffbc0d);
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.contributions-list {
		margin: 0;
		padding-left: 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--theme-text-main, #ffffff);
		opacity: 0.94;
	}

	/* Placeholder state */
	.placeholder-view {
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 0.85rem;
		padding: 2.5rem 1rem;
	}

	.placeholder-icon {
		font-size: 2.4rem;
		color: var(--theme-gold, #ffbc0d);
		filter: drop-shadow(0 0 14px rgba(255, 188, 13, 0.45));
	}

	.placeholder-title {
		margin: 0;
		font-size: 1.45rem;
		font-weight: 800;
	}

	.placeholder-text {
		margin: 0;
		font-size: 0.88rem;
		color: var(--theme-text-muted, #94a3b8);
		max-width: 280px;
		line-height: 1.5;
	}

	.actions {
		display: flex;
		justify-content: center;
		padding-top: 0.5rem;
	}

	/* Responsive layout */
	@media (max-width: 860px) {
		.credits-main {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.side-panel {
			min-height: auto;
		}
	}
</style>
