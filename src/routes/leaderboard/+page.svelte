<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui';
	import { navigating } from '$app/stores';

	let { data }: { data: PageData } = $props();

	let expandedAttemptId = $state<string | null>(null);
	const toggleExpand = (id: string) => {
		expandedAttemptId = expandedAttemptId === id ? null : id;
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const formatCompletedAt = (date: Date | string) =>
		new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(date));
</script>

<svelte:head>
	<title>Leaderboard · ランキング · Japanese Quiz Game</title>
	<meta name="description" content="Japanese Quiz Game leaderboard" />
</svelte:head>

<div class="leaderboard-page">
	<div class="leaderboard-container">
		<header class="leaderboard-header">
			<h1 class="title font-brush text-gold-gradient">ランキング</h1>
		</header>

		<nav class="level-filter" aria-label="Filter leaderboard by level">
			<a href={resolve('/leaderboard')} class:active={data.level === 'all'}> All </a>
			<a href="{resolve('/leaderboard')}?level=N3" class:active={data.level === 'N3'}> N3 </a>
			<a href="{resolve('/leaderboard')}?level=N4" class:active={data.level === 'N4'}> N4 </a>
		</nav>

		{#if data.leaderboard.length === 0}
			<div class="empty-state">
				<i class="fa-solid fa-ranking-star empty-icon"></i>
				<h2>No scores yet</h2>
				<p>
					There are no finished quiz games for this level yet. Complete a quiz and be the first on
					the leaderboard!
				</p>
			</div>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th class="col-rank">Rank</th>
							<th class="col-player">Player</th>
							<th class="col-run">Run</th>
							<th class="col-level">Level</th>
							<th class="col-score">Score</th>
							<th class="col-time">Time</th>
							<th class="col-completed">Completed</th>
							<th class="col-expand" aria-label="Expand details"></th>
						</tr>
					</thead>

					<tbody>
						{#if $navigating}
							{#each [0, 1, 2, 3, 4] as idx (idx)}
								<tr class="skeleton-row">
									<td class="position col-rank">
										<div
											class="skeleton"
											style="width: 28px; height: 1.1rem; margin: 0 auto;"
										></div>
									</td>
									<td class="nickname col-player">
										<div
											class="skeleton"
											style="width: {80 + (idx % 3) * 20}px; height: 1.1rem;"
										></div>
									</td>
									<td class="col-run">
										<div class="skeleton" style="width: 64px; height: 1.1rem;"></div>
									</td>
									<td class="col-level">
										<div
											class="skeleton"
											style="width: 36px; height: 1.1rem; margin: 0 auto; border-radius: 999px;"
										></div>
									</td>
									<td class="score col-score">
										<div
											class="skeleton"
											style="width: 32px; height: 1.1rem; margin: 0 auto;"
										></div>
									</td>
									<td class="time col-time">
										<div
											class="skeleton"
											style="width: 44px; height: 1.1rem; margin: 0 auto;"
										></div>
									</td>
									<td class="col-completed">
										<div class="skeleton" style="width: 120px; height: 1.1rem;"></div>
									</td>
									<td class="col-expand"></td>
								</tr>
							{/each}
						{:else}
							{#each data.leaderboard as entry (entry.attemptId)}
								<tr
									class="table-row-item"
									class:current-player={entry.isCurrentPlayer}
									onclick={() => toggleExpand(entry.attemptId)}
								>
									<td class="position col-rank">
										{#if entry.position === 1}
											<span class="rank-badge rank-1 font-mono">
												<i class="fa-solid fa-crown"></i>
												<span>1</span>
											</span>
										{:else if entry.position === 2}
											<span class="rank-badge rank-2 font-mono">
												<i class="fa-solid fa-medal"></i>
												<span>2</span>
											</span>
										{:else if entry.position === 3}
											<span class="rank-badge rank-3 font-mono">
												<i class="fa-solid fa-medal"></i>
												<span>3</span>
											</span>
										{:else}
											<span class="rank-number font-mono">
												#{entry.position}
											</span>
										{/if}
									</td>

									<td class="nickname col-player">
										<div class="player-cell">
											{#if entry.avatarUrl}
												<img
													src={entry.avatarUrl}
													alt=""
													class="leaderboard-avatar"
													referrerpolicy="no-referrer"
												/>
											{:else if entry.isSavedAccount}
												<i
													class="fa-brands fa-google leaderboard-google-icon"
													title="Google Account"
												></i>
											{/if}
											<span class="player-name">{entry.nickname}</span>
											{#if entry.isCurrentPlayer}
												<span class="you">You</span>
											{/if}
										</div>
									</td>

									<td class="run-id col-run" title={`Run ID: ${entry.attemptId}`}>
										{entry.attemptId.slice(0, 6).toUpperCase()}
									</td>

									<td class="col-level">
										<span class="level-badge">
											{entry.level}
										</span>
									</td>

									<td class="score col-score">
										{entry.score}
									</td>

									<td class="time col-time">
										{formatTime(entry.timeSeconds)}
									</td>

									<td class="completed-at col-completed">{formatCompletedAt(entry.finishedAt)}</td>

									<td class="col-expand">
										<button
											type="button"
											class="expand-icon-btn"
											aria-label="Toggle details for run {entry.attemptId}"
											aria-expanded={expandedAttemptId === entry.attemptId}
											onclick={(e) => {
												e.stopPropagation();
												toggleExpand(entry.attemptId);
											}}
										>
											<i
												class="fa-solid fa-chevron-down expand-chevron"
												class:rotated={expandedAttemptId === entry.attemptId}
											></i>
										</button>
									</td>
								</tr>
								{#if expandedAttemptId === entry.attemptId}
									<tr class="detail-row">
										<td colspan="8">
											<div class="detail-drawer font-mono">
												<div class="detail-item">
													<span class="detail-label">RUN:</span>
													<span class="detail-value"
														>{entry.attemptId.slice(0, 8).toUpperCase()}</span
													>
												</div>
												<div class="detail-item">
													<span class="detail-label">COMPLETED:</span>
													<span class="detail-value">{formatCompletedAt(entry.finishedAt)}</span>
												</div>
											</div>
										</td>
									</tr>
								{/if}
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		{/if}

		<div class="actions">
			<Button href={resolve('/')} variant="gold" size="md">
				<i class="fa-solid fa-house"></i>
				<span>Back to Home</span>
			</Button>
		</div>
	</div>
</div>

<style>
	.leaderboard-page {
		height: 100dvh;
		padding: 1.5rem 1rem;
		display: flex;
		justify-content: center;
		overflow: hidden;
	}

	.leaderboard-container {
		width: min(100%, 800px);
		height: 100%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.leaderboard-header {
		text-align: center;
	}

	.title {
		margin: 0;
		font-size: clamp(2.2rem, 5vw, 3rem);
		font-weight: 900;
		letter-spacing: 0.05em;
	}

	.level-filter {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.level-filter a {
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-pill, 9999px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		background: var(--theme-paper, rgba(255, 255, 255, 0.05));
		color: var(--theme-text-muted, #94a3b8);
		text-decoration: none;
		font-weight: 700;
		font-size: 0.9rem;
		position: relative;
		overflow: hidden;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		user-select: none;
		box-shadow: 0 4px 14px rgba(0, 15, 45, 0.25);
	}

	.level-filter a:hover:not(.active) {
		background: color-mix(in srgb, var(--theme-paper, #05367b) 75%, #1952a8 25%);
		color: #ffffff;
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
	}

	.level-filter a.active {
		background: var(--theme-gold-shimmer, #ffbc0d);
		border-color: var(--theme-gold, #ffbc0d);
		color: #022659;
		font-weight: 800;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
		transform: translateY(-2px);
	}

	.level-filter a.active:hover {
		filter: brightness(1.05);
	}

	.level-filter a:active {
		transform: translateY(1px) scale(0.98);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
	}

	.table-wrapper {
		flex: 1;
		min-height: 0;
		overflow: auto;
		border-radius: 0 !important;
		background: rgba(0, 15, 45, 0.6);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}

	.col-expand,
	.detail-row {
		display: none;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	th,
	td {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
	}

	th {
		position: sticky;
		top: 0;
		z-index: 2;
		background: var(--theme-paper);
		box-shadow: 0 1px 0 var(--theme-border, rgba(255, 255, 255, 0.08));
		font-family: var(--font-mono, monospace);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--theme-text-muted, #94a3b8);
	}

	tr:last-child td {
		border-bottom: none;
	}

	tr.current-player {
		background: rgba(255, 188, 13, 0.08);
	}

	.position {
		font-family: var(--font-mono, monospace);
		font-weight: 700;
	}

	.rank-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.22rem 0.65rem;
		border-radius: var(--radius-pill, 9999px);
		font-weight: 900;
		font-size: 0.82rem;
		letter-spacing: 0.02em;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
		line-height: 1;
	}

	/* Top 1: Solid Yellow */
	.rank-1 {
		background: var(--theme-gold, #ffbc0d);
		color: #022659;
		border: 1px solid #ffd043;
	}

	/* Top 2: Solid Silver */
	.rank-2 {
		background: #cbd5e1;
		color: #0f172a;
		border: 1px solid #e2e8f0;
	}

	/* Top 3: Solid Bronze */
	.rank-3 {
		background: #cd7f32;
		color: #ffffff;
		border: 1px solid #df954d;
	}

	.rank-number {
		font-weight: 700;
		color: var(--theme-text-muted, #94a3b8);
		padding-left: 0.25rem;
	}

	.nickname {
		font-weight: 700;
		color: var(--theme-text-main, #ffffff);
	}

	.col-rank {
		text-align: center;
		width: 75px;
	}

	.col-player {
		text-align: left;
	}

	.col-level {
		text-align: center;
		width: 75px;
	}

	.col-score {
		text-align: center;
		width: 75px;
	}

	.col-time {
		text-align: right;
		width: 85px;
	}

	.col-run {
		width: 90px;
	}

	.col-completed {
		width: 170px;
	}

	.player-cell {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		max-width: 100%;
	}

	.player-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.leaderboard-avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		object-fit: cover;
		border: 1px solid var(--theme-gold, #ffbc0d);
		flex-shrink: 0;
	}

	.leaderboard-google-icon {
		font-size: 0.85rem;
		color: var(--theme-gold, #ffbc0d);
		flex-shrink: 0;
	}

	.you {
		display: inline-block;
		margin-left: 0.5rem;
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
		background: var(--theme-gold, #ffbc0d);
		color: #000f2d;
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.level-badge {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.08);
		font-size: 0.8rem;
		font-weight: 700;
	}

	.score {
		font-family: var(--font-mono, monospace);
		font-weight: 800;
		font-size: 1.05rem;
		color: var(--theme-gold, #ffbc0d);
	}

	.time {
		font-family: var(--font-mono, monospace);
		color: var(--theme-text-muted, #94a3b8);
	}

	.run-id,
	.completed-at {
		font-family: var(--font-mono, monospace);
		color: var(--theme-text-muted, #94a3b8);
		font-size: 0.8rem;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
		text-align: center;
		border-radius: 0 !important;
		background: rgba(0, 15, 45, 0.6);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		gap: 0.75rem;
	}

	.empty-icon {
		font-size: 2.5rem;
		color: var(--theme-gold, #ffbc0d);
		margin-bottom: 0.5rem;
	}

	.empty-state h2 {
		margin: 0;
		font-size: 1.3rem;
		color: var(--theme-text-main, #ffffff);
	}

	.empty-state p {
		margin: 0;
		max-width: 420px;
		color: var(--theme-text-muted, #94a3b8);
		line-height: 1.5;
		font-size: 0.95rem;
	}

	.actions {
		display: flex;
		justify-content: center;
		margin-top: auto;
		flex-shrink: 0;
	}

	@media (max-height: 720px) {
		.leaderboard-page {
			padding-block: 1rem;
		}

		.leaderboard-container {
			gap: 0.75rem;
		}

		.title {
			font-size: clamp(2rem, 5vw, 2.5rem);
		}
	}

	@media (max-width: 640px) {
		.leaderboard-page {
			padding: 0.9rem 0.65rem 1rem;
		}

		.leaderboard-container {
			gap: 0.65rem;
		}

		.table-wrapper {
			border-radius: 0 !important;
		}

		.leaderboard-header {
			padding-inline: 2rem;
		}

		.title {
			font-size: 1.85rem;
		}

		.level-filter {
			gap: 0.45rem;
		}

		.level-filter a {
			font-size: 0.82rem;
			padding: 0.38rem 0.95rem;
			min-height: 32px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		/* Hide secondary desktop-only columns on mobile */
		.col-run,
		.col-completed {
			display: none;
		}

		.col-rank {
			width: 44px;
			padding-left: 0.55rem;
			padding-right: 0.35rem;
		}

		.col-player {
			padding-left: 0.35rem;
			padding-right: 0.35rem;
		}

		.col-level {
			width: 44px;
			padding-left: 0.25rem;
			padding-right: 0.25rem;
		}

		.col-score {
			width: 44px;
			padding-left: 0.25rem;
			padding-right: 0.25rem;
		}

		.col-time {
			width: 54px;
			padding-left: 0.25rem;
			padding-right: 0.55rem;
		}

		th,
		td {
			padding: 0.65rem 0.45rem;
			font-size: 0.8rem;
		}

		th {
			font-size: 0.68rem;
			letter-spacing: 0.06em;
		}

		.player-name {
			max-width: clamp(75px, 25vw, 120px);
			font-size: 0.84rem;
		}

		.leaderboard-avatar {
			width: 22px;
			height: 22px;
		}

		.rank-badge {
			font-size: 0.72rem;
			padding: 0.16rem 0.42rem;
			gap: 0.2rem;
		}

		.rank-badge i {
			font-size: 0.62rem;
		}

		.rank-number {
			font-size: 0.78rem;
			padding-left: 0;
		}

		.level-badge {
			font-size: 0.72rem;
			padding: 0.16rem 0.42rem;
		}

		.score {
			font-size: 0.95rem;
		}

		.time {
			font-size: 0.76rem;
		}

		.you {
			font-size: 0.62rem;
			padding: 0.12rem 0.38rem;
			margin-left: 0.35rem;
		}

		.actions :global(.ui-btn) {
			min-height: 40px;
			padding: 0.45rem 1.25rem;
			font-size: 0.86rem;
		}

		.col-expand {
			display: table-cell;
			width: 28px;
			text-align: center;
			padding: 0.65rem 0.25rem;
		}

		.table-row-item {
			cursor: pointer;
			-webkit-tap-highlight-color: transparent;
			transition: background 0.15s ease;
		}

		.table-row-item:active {
			background: rgba(255, 255, 255, 0.06);
		}

		.expand-icon-btn {
			background: transparent;
			border: none;
			color: var(--theme-text-muted, #94a3b8);
			cursor: pointer;
			padding: 0.2rem;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: 0.7rem;
		}

		.expand-chevron {
			transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		}

		.expand-chevron.rotated {
			transform: rotate(180deg);
			color: var(--theme-gold, #ffbc0d);
		}

		.detail-row {
			display: table-row;
			background: rgba(0, 10, 30, 0.5);
		}

		.detail-row td {
			padding: 0.45rem 0.65rem 0.6rem;
			border-bottom: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
		}

		.detail-drawer {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem 1rem;
			font-size: 0.72rem;
			padding: 0.35rem 0.6rem;
			background: rgba(255, 255, 255, 0.04);
			border-left: 3px solid var(--theme-gold, #ffbc0d);
		}

		.detail-item {
			display: inline-flex;
			align-items: center;
			gap: 0.35rem;
		}

		.detail-label {
			color: var(--theme-text-muted, #94a3b8);
			font-weight: 700;
			font-size: 0.68rem;
		}

		.detail-value {
			color: var(--theme-text-main, #ffffff);
			font-size: 0.74rem;
		}
	}
</style>
