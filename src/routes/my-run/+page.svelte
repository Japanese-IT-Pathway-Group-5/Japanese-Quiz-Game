<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui';

	let { data }: { data: PageData } = $props();

	let selectedLevel = $state<'all' | 'N3' | 'N4'>('all');
	let currentPage = $state(1);
	let isChangingPage = $state(false);
	let showAllStats = $state(false);
	let expandedRunId = $state<string | null>(null);

	function toggleExpandRun(id: string) {
		expandedRunId = expandedRunId === id ? null : id;
	}

	const ITEMS_PER_PAGE = 10;
	const filteredRuns = $derived(
		selectedLevel === 'all' ? data.runs : data.runs.filter((r) => r.level === selectedLevel)
	);
	const totalRuns = $derived(filteredRuns.length);
	const totalPages = $derived(Math.max(1, Math.ceil(totalRuns / ITEMS_PER_PAGE)));
	const paginatedRuns = $derived(
		filteredRuns.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
	);
	const pageList = $derived(Array.from({ length: totalPages }, (_, i) => i + 1));
	const skeletonRows = [0, 1, 2, 3, 4];

	function selectLevel(lvl: 'all' | 'N3' | 'N4') {
		selectedLevel = lvl;
		currentPage = 1;
	}

	function changePage(newPage: number) {
		if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
		isChangingPage = true;
		currentPage = newPage;
		setTimeout(() => {
			isChangingPage = false;
		}, 140);
	}

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const formatTotalTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;
		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		if (minutes > 0) {
			return `${minutes}m ${remainingSeconds}s`;
		}
		return `${remainingSeconds}s`;
	};

	const formatDate = (date: Date | string) =>
		new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(date));
</script>

<svelte:head>
	<title>My Runs & Analytics · マイラン · Japanese Quiz Game</title>
	<meta name="description" content="Player performance analytics and quiz run history" />
</svelte:head>

<div class="page-shell">
	<div class="dashboard-layout">
		<!-- Dashboard Header -->
		<header class="dashboard-header">
			<h1 class="title font-brush text-gold-gradient">マイラン</h1>
		</header>

		{#if data.isAuthenticated && data.player}
			<!-- KPI Analytics Cards (4 Key Metrics) -->
			{#if data.stats}
				<div class="stats-controls">
					<button
						type="button"
						class="stats-toggle-btn font-mono"
						onclick={() => (showAllStats = !showAllStats)}
						aria-expanded={showAllStats}
					>
						<span>{showAllStats ? 'Show less' : 'See more'}</span>
						<i class="fa-solid fa-chevron-down toggle-icon" class:rotated={showAllStats}></i>
					</button>
				</div>

				<section class="kpi-grid" aria-label="Key Performance Indicators">
					<div class="kpi-card">
						<div class="kpi-header">
							<span class="kpi-label font-mono">ACCURACY RATE</span>
							<i class="fa-solid fa-bullseye kpi-icon"></i>
						</div>
						<div class="kpi-value font-mono">{data.stats.overallAccuracy}%</div>
					</div>

					<div class="kpi-card">
						<div class="kpi-header">
							<span class="kpi-label font-mono">BEST SCORE</span>
							<i class="fa-solid fa-trophy kpi-icon text-gold"></i>
						</div>
						<div class="kpi-value font-mono text-white">{data.stats.bestScore}</div>
						<div class="kpi-footer font-mono">
							<span>N4: {data.stats.bestScoreN4 ?? '-'}</span>
							<span class="dot">·</span>
							<span>N3: {data.stats.bestScoreN3 ?? '-'}</span>
						</div>
					</div>

					<div class="kpi-card kpi-secondary" class:kpi-collapsed={!showAllStats}>
						<div class="kpi-header">
							<span class="kpi-label font-mono">TOTAL RUNS</span>
							<i class="fa-solid fa-gamepad kpi-icon"></i>
						</div>
						<div class="kpi-value font-mono">{data.stats.totalRuns}</div>
						<div class="kpi-footer font-mono">
							<span>Avg: {data.stats.averageScore} pts</span>
						</div>
					</div>

					<div class="kpi-card kpi-secondary" class:kpi-collapsed={!showAllStats}>
						<div class="kpi-header">
							<span class="kpi-label font-mono">PRACTICE TIME</span>
							<i class="fa-solid fa-stopwatch kpi-icon"></i>
						</div>
						<div class="kpi-value font-mono">{formatTotalTime(data.stats.totalTimeSeconds)}</div>
						<div class="kpi-footer font-mono">Total study session</div>
					</div>
				</section>

				<!-- Level Mastery Breakdown (N4 vs N3) -->
				<section
					class="mastery-grid"
					class:mastery-collapsed={!showAllStats}
					aria-label="Level Mastery Breakdown"
				>
					<div class="mastery-card">
						<div class="mastery-top">
							<span class="level-pill font-japanese">N4 初級</span>
							<span class="mastery-runs font-mono">{data.stats.n4RunsCount} runs</span>
						</div>
						<div class="mastery-stats font-mono">
							<div class="m-stat">
								<span class="m-label">Best</span>
								<span class="m-val">{data.stats.bestScoreN4 ?? '-'}</span>
							</div>
							<div class="m-stat">
								<span class="m-label">Accuracy</span>
								<span class="m-val"
									>{data.stats.n4Accuracy !== null ? `${data.stats.n4Accuracy}%` : '-'}</span
								>
							</div>
						</div>
					</div>

					<div class="mastery-card">
						<div class="mastery-top">
							<span class="level-pill font-japanese">N3 中級</span>
							<span class="mastery-runs font-mono">{data.stats.n3RunsCount} runs</span>
						</div>
						<div class="mastery-stats font-mono">
							<div class="m-stat">
								<span class="m-label">Best</span>
								<span class="m-val">{data.stats.bestScoreN3 ?? '-'}</span>
							</div>
							<div class="m-stat">
								<span class="m-label">Accuracy</span>
								<span class="m-val"
									>{data.stats.n3Accuracy !== null ? `${data.stats.n3Accuracy}%` : '-'}</span
								>
							</div>
						</div>
					</div>
				</section>
			{/if}

			<!-- Run History Table Section -->
			<section class="table-section" aria-labelledby="history-heading">
				<div class="table-controls">
					<div class="table-heading font-mono" id="history-heading">
						<i class="fa-solid fa-clock-rotate-left"></i>
						<span>RUN HISTORY ({totalRuns})</span>
					</div>

					<nav class="level-filter" aria-label="Filter runs by level">
						<button
							type="button"
							class="filter-tab font-mono"
							class:active={selectedLevel === 'all'}
							onclick={() => selectLevel('all')}
						>
							All
						</button>
						<button
							type="button"
							class="filter-tab font-mono"
							class:active={selectedLevel === 'N3'}
							onclick={() => selectLevel('N3')}
						>
							N3
						</button>
						<button
							type="button"
							class="filter-tab font-mono"
							class:active={selectedLevel === 'N4'}
							onclick={() => selectLevel('N4')}
						>
							N4
						</button>
					</nav>
				</div>

				{#if filteredRuns.length === 0}
					<div class="empty-state font-mono">
						<i class="fa-solid fa-gamepad empty-icon"></i>
						<h3>No quiz runs recorded</h3>
						<p>
							{#if selectedLevel === 'all'}
								You have not completed any quiz runs yet. Complete a quiz to start building your
								analytics!
							{:else}
								No {selectedLevel} runs recorded. Take a {selectedLevel} quiz to see it here!
							{/if}
						</p>
					</div>
				{:else}
					<div class="table-wrapper">
						<table>
							<thead>
								<tr>
									<th class="col-run">Run</th>
									<th class="col-level">Level</th>
									<th class="col-score">Score</th>
									<th class="col-accuracy">Accuracy</th>
									<th class="col-time">Time</th>
									<th class="col-date">Date</th>
									<th class="col-action">Action</th>
									<th class="col-expand" aria-label="Expand details"></th>
								</tr>
							</thead>

							<tbody>
								{#if isChangingPage}
									{#each skeletonRows as rowIdx (rowIdx)}
										<tr class="skeleton-row">
											<td colspan="8">
												<div class="skeleton-bar"></div>
											</td>
										</tr>
									{/each}
								{:else}
									{#each paginatedRuns as run (run.attemptId)}
										<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
										<tr
											class="table-row-item"
											onclick={() => toggleExpandRun(run.attemptId)}
										>
											<td class="run-id col-run font-mono">
												{run.attemptId.slice(0, 6).toUpperCase()}
											</td>

											<td class="col-level">
												<span class="level-badge font-japanese">{run.level}</span>
											</td>

											<td class="score col-score font-mono">
												{run.score}
											</td>

											<td class="stat-text col-accuracy font-mono">
												{run.accuracy}%
											</td>

											<td class="time-text col-time font-mono">
												{formatTime(run.timeSeconds)}
											</td>

											<td class="date-text col-date font-mono">
												{formatDate(run.finishedAt)}
											</td>

											<td class="col-action" onclick={(e) => e.stopPropagation()}>
												<Button
													href="{resolve(`/review/${run.attemptId}`)}?from=my-run"
													variant="gold"
													size="sm"
												>
													<i class="fa-solid fa-magnifying-glass"></i>
													<span>Review</span>
												</Button>
											</td>

											<td class="col-expand">
												<button
													type="button"
													class="expand-icon-btn"
													aria-label="Toggle details for run {run.attemptId}"
													aria-expanded={expandedRunId === run.attemptId}
													onclick={(e) => {
														e.stopPropagation();
														toggleExpandRun(run.attemptId);
													}}
												>
													<i
														class="fa-solid fa-chevron-down expand-chevron"
														class:rotated={expandedRunId === run.attemptId}
													></i>
												</button>
											</td>
										</tr>
										{#if expandedRunId === run.attemptId}
											<tr class="detail-row">
												<td colspan="8">
													<div class="detail-drawer font-mono">
														<div class="detail-item">
															<span class="detail-label">RUN:</span>
															<span class="detail-value">{run.attemptId.slice(0, 8).toUpperCase()}</span>
														</div>
														<div class="detail-item">
															<span class="detail-label">DATE:</span>
															<span class="detail-value">{formatDate(run.finishedAt)}</span>
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

					<!-- Pagination Controls -->
					{#if totalPages > 1}
						<nav class="pagination-bar font-mono" aria-label="Run history pages">
							<button
								type="button"
								class="page-nav-btn"
								disabled={currentPage === 1}
								onclick={() => changePage(currentPage - 1)}
								aria-label="Previous Page"
							>
								<i class="fa-solid fa-chevron-left"></i>
								<span>Prev</span>
							</button>

							<div class="page-numbers">
								{#each pageList as pageNum (pageNum)}
									<button
										type="button"
										class="page-number"
										class:active={pageNum === currentPage}
										onclick={() => changePage(pageNum)}
										aria-label="Page {pageNum}"
										aria-current={pageNum === currentPage ? 'page' : undefined}
									>
										{pageNum}
									</button>
								{/each}
							</div>

							<button
								type="button"
								class="page-nav-btn"
								disabled={currentPage === totalPages}
								onclick={() => changePage(currentPage + 1)}
								aria-label="Next Page"
							>
								<span>Next</span>
								<i class="fa-solid fa-chevron-right"></i>
							</button>
						</nav>
					{/if}
				{/if}
			</section>
		{:else}
			<!-- Guest State -->
			<div class="guest-card" role="region" aria-label="Sign in">
				<i class="fa-brands fa-google guest-icon"></i>
				<h2 class="guest-title font-brush text-gold-gradient">Sign in for Player Analytics</h2>
				<p class="guest-desc">
					Link your Google account to automatically track your Japanese quiz accuracy, record
					mastery over N4/N3 levels, review past quiz questions, and secure leaderboard rankings.
				</p>

				<a
					href="{resolve('/auth/google')}?returnTo=/my-run"
					class="google-btn font-mono"
					aria-label="Sign in with Google"
				>
					<svg class="google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
						/>
					</svg>
					<span>Sign in with Google</span>
				</a>
			</div>
		{/if}

		<!-- Action Buttons -->
		<footer class="actions">
			<Button href={resolve('/')} variant="gold" size="md">
				<i class="fa-solid fa-house"></i>
				<span>Back to Home</span>
			</Button>

			<Button href={resolve('/leaderboard')} variant="secondary" size="md">
				<i class="fa-solid fa-ranking-star"></i>
				<span>Leaderboard</span>
			</Button>
		</footer>
	</div>
</div>

<style>
	.page-shell {
		min-height: 100dvh;
		padding: 2rem 1rem 3.5rem;
		display: flex;
		justify-content: center;
	}

	.dashboard-layout {
		width: min(100%, 860px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.dashboard-header {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.title {
		margin: 0;
		font-size: clamp(2.4rem, 6vw, 3.2rem);
		font-weight: 900;
		letter-spacing: 0.05em;
	}

	/* Stats Controls Header */
	.stats-controls {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.stats-toggle-btn {
		display: none;
	}

	/* KPI Analytics Cards */
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.85rem;
	}

	.kpi-card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1rem 1.1rem;
		border-radius: var(--radius-lg, 1rem);
		background: rgba(0, 15, 45, 0.45);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
	}

	.kpi-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.kpi-label {
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		color: var(--theme-text-muted, #94a3b8);
		font-weight: 700;
	}

	.kpi-icon {
		font-size: 0.85rem;
		color: var(--theme-text-muted, #94a3b8);
	}

	.kpi-value {
		font-size: 1.55rem;
		font-weight: 800;
		color: var(--theme-text-main, #ffffff);
		line-height: 1.1;
		margin: 0.1rem 0;
	}

	.kpi-footer {
		font-size: 0.72rem;
		color: var(--theme-text-muted, #94a3b8);
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.text-gold {
		color: var(--theme-gold, #ffbc0d);
	}

	.dot {
		color: rgba(255, 255, 255, 0.2);
	}

	/* Level Mastery Breakdown */
	.mastery-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.85rem;
	}

	.mastery-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-radius: var(--radius-lg, 1rem);
		background: rgba(0, 15, 45, 0.45);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
	}

	.mastery-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.level-pill {
		display: inline-block;
		padding: 0.2rem 0.55rem;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.08);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--theme-text-main, #ffffff);
	}

	.mastery-runs {
		font-size: 0.75rem;
		color: var(--theme-text-muted, #94a3b8);
	}

	.mastery-stats {
		display: flex;
		gap: 1.5rem;
	}

	.m-stat {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.m-label {
		font-size: 0.68rem;
		color: var(--theme-text-muted, #94a3b8);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.m-val {
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--theme-text-main, #ffffff);
	}

	/* Run History Table Section */
	.table-section {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.table-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.table-heading {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--theme-text-main, #ffffff);
	}

	/* Level Filter Tabs (Identical to Leaderboard) */
	.level-filter {
		display: flex;
		gap: 0.4rem;
	}

	.filter-tab {
		padding: 0.35rem 0.9rem;
		border-radius: var(--radius-pill, 9999px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		background: var(--theme-paper, rgba(255, 255, 255, 0.05));
		color: var(--theme-text-muted, #94a3b8);
		font-weight: 700;
		font-size: 0.78rem;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		user-select: none;
	}

	.filter-tab:hover:not(.active) {
		background: color-mix(in srgb, var(--theme-paper, #05367b) 75%, #1952a8 25%);
		color: #ffffff;
		transform: translateY(-1px);
	}

	.filter-tab.active {
		background: var(--theme-gold-shimmer, #ffbc0d);
		border-color: var(--theme-gold, #ffbc0d);
		color: #022659;
		font-weight: 800;
		transform: translateY(-1px);
	}

	/* Table (Modern Analytics Table) */
	.table-wrapper {
		overflow: auto;
		border-radius: 0 !important;
		background: rgba(0, 15, 45, 0.5);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
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
		padding: 0.85rem 1.1rem;
		border-bottom: 1px solid var(--theme-border, rgba(255, 255, 255, 0.06));
	}

	th {
		position: sticky;
		top: 0;
		z-index: 2;
		background: var(--theme-paper, #05367b);
		font-family: var(--font-mono, monospace);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--theme-text-muted, #94a3b8);
	}

	tr:last-child td {
		border-bottom: none;
	}

	.run-id {
		font-size: 0.78rem;
		color: var(--theme-text-muted, #94a3b8);
		font-weight: 700;
	}

	.level-badge {
		display: inline-block;
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.08);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--theme-text-main, #ffffff);
	}

	.score {
		font-weight: 800;
		font-size: 1rem;
		color: var(--theme-gold, #ffbc0d);
	}

	.stat-text {
		font-size: 0.85rem;
		color: var(--theme-text-main, #ffffff);
	}

	.time-text,
	.date-text {
		color: var(--theme-text-muted, #94a3b8);
		font-size: 0.78rem;
	}

	/* Pagination Bar */
	.pagination-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding-top: 0.5rem;
	}

	.page-nav-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.75rem;
		border-radius: var(--radius-pill, 9999px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		background: rgba(0, 15, 45, 0.4);
		color: var(--theme-text-muted, #94a3b8);
		font-size: 0.75rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.page-nav-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
		color: #ffffff;
	}

	.page-nav-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.page-numbers {
		display: flex;
		gap: 0.3rem;
	}

	.page-number {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: none;
		background: transparent;
		color: var(--theme-text-muted, #94a3b8);
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
	}

	.page-number:hover:not(.active) {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.08);
	}

	.page-number.active {
		background: var(--theme-gold, #ffbc0d);
		color: #022659;
		font-weight: 900;
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
		text-align: center;
		border-radius: 0 !important;
		background: rgba(0, 15, 45, 0.45);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
		gap: 0.5rem;
	}

	.empty-icon {
		font-size: 2.2rem;
		color: var(--theme-gold, #ffbc0d);
		margin-bottom: 0.25rem;
	}

	.empty-state h3 {
		margin: 0;
		font-size: 1.15rem;
		color: var(--theme-text-main, #ffffff);
	}

	.empty-state p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--theme-text-muted, #94a3b8);
		max-width: 380px;
		line-height: 1.45;
	}

	/* Guest Card */
	.guest-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1.5rem;
		text-align: center;
		border-radius: var(--radius-lg, 1rem);
		background: rgba(0, 15, 45, 0.45);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
		gap: 0.75rem;
	}

	.guest-icon {
		font-size: 2.5rem;
		color: var(--theme-gold, #ffbc0d);
		margin-bottom: 0.25rem;
	}

	.guest-title {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 900;
	}

	.guest-desc {
		margin: 0;
		font-size: 0.9rem;
		color: var(--theme-text-muted, #94a3b8);
		max-width: 440px;
		line-height: 1.5;
	}

	.google-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
		background: #ffffff;
		color: #1f2937;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.9rem;
		margin-top: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
		transition: all 0.2s ease;
	}

	.google-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
	}

	.skeleton-bar {
		height: 20px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 4px;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 0.2;
		}
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
	}

	.col-level {
		text-align: center;
		width: 70px;
	}

	.col-score {
		text-align: center;
		width: 70px;
	}

	.col-accuracy {
		text-align: center;
		width: 85px;
	}

	.col-time {
		text-align: right;
		width: 80px;
	}

	.col-run {
		width: 85px;
	}

	.col-date {
		width: 140px;
	}

	.col-action {
		text-align: right;
		width: 100px;
	}

	@media (max-width: 640px) {
		.page-shell {
			height: 100dvh;
			padding: 0.75rem 0.65rem 0.75rem;
			display: flex;
			justify-content: center;
			overflow: hidden;
		}

		.dashboard-layout {
			width: 100%;
			height: 100%;
			min-height: 0;
			display: flex;
			flex-direction: column;
			gap: 0.55rem;
		}

		.dashboard-header {
			padding-inline: 2rem;
			flex-shrink: 0;
		}

		.title {
			font-size: 1.75rem;
		}

		.stats-controls {
			flex-shrink: 0;
			display: flex;
			justify-content: flex-end;
			padding-inline: 0.15rem;
		}

		.stats-toggle-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 0.35rem;
			padding: 0.22rem 0.6rem;
			border-radius: var(--radius-pill, 9999px);
			border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.12));
			background: var(--theme-paper, rgba(255, 255, 255, 0.05));
			color: var(--theme-text-muted, #94a3b8);
			font-size: 0.72rem;
			font-weight: 700;
			cursor: pointer;
			transition: all 0.2s ease;
		}

		.stats-toggle-btn:hover {
			color: #ffffff;
			border-color: var(--theme-gold, #ffbc0d);
		}

		/* Sleek, compact 2x2 KPI grid */
		.kpi-grid {
			flex-shrink: 0;
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}

		.kpi-card {
			padding: 0.65rem 0.75rem;
			gap: 0.2rem;
			border-radius: var(--radius-md);
		}

		.kpi-label {
			font-size: 0.6rem;
		}

		.kpi-icon {
			font-size: 0.75rem;
		}

		.kpi-value {
			font-size: 1.25rem;
		}

		.kpi-footer {
			font-size: 0.65rem;
		}

		/* Compact side-by-side mastery cards */
		.mastery-grid {
			flex-shrink: 0;
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}

		.mastery-card {
			padding: 0.65rem 0.75rem;
			gap: 0.45rem;
			border-radius: var(--radius-md);
		}

		.level-pill {
			font-size: 0.74rem;
			padding: 0.15rem 0.45rem;
		}

		.mastery-runs {
			font-size: 0.68rem;
		}

		.mastery-stats {
			gap: 0.85rem;
		}

		.m-label {
			font-size: 0.6rem;
		}

		.m-val {
			font-size: 0.95rem;
		}

		/* Compact table controls */
		.table-section {
			flex: 1;
			min-height: 0;
			display: flex;
			flex-direction: column;
			gap: 0.45rem;
		}

		.table-controls {
			flex-shrink: 0;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
		}

		.table-heading {
			font-size: 0.74rem;
		}

		.level-filter {
			gap: 0.3rem;
		}

		.filter-tab {
			font-size: 0.75rem;
			padding: 0.25rem 0.65rem;
			min-height: 28px;
		}

		.table-wrapper {
			flex: 1;
			min-height: 0;
			overflow: auto;
			border-radius: 0 !important;
		}

		/* Hide non-essential columns on mobile */
		.col-run,
		.col-date {
			display: none;
		}

		.col-level {
			width: 44px;
			padding-left: 0.5rem;
			padding-right: 0.25rem;
		}

		.col-score {
			width: 44px;
			padding-left: 0.25rem;
			padding-right: 0.25rem;
		}

		.col-accuracy {
			width: 52px;
			padding-left: 0.25rem;
			padding-right: 0.25rem;
		}

		.col-time {
			width: 52px;
			padding-left: 0.25rem;
			padding-right: 0.25rem;
		}

		.col-action {
			width: 72px;
			padding-left: 0.25rem;
			padding-right: 0.5rem;
		}

		th,
		td {
			padding: 0.6rem 0.35rem;
			font-size: 0.8rem;
		}

		th {
			font-size: 0.66rem;
			letter-spacing: 0.05em;
		}

		.level-badge {
			font-size: 0.72rem;
			padding: 0.14rem 0.38rem;
		}

		.score {
			font-size: 0.95rem;
		}

		.stat-text {
			font-size: 0.78rem;
		}

		.time-text {
			font-size: 0.75rem;
		}

		.col-action :global(.ui-btn) {
			min-height: 28px;
			padding: 0.2rem 0.5rem;
			font-size: 0.72rem;
			gap: 0.25rem;
		}

		/* Pagination */
		.pagination-bar {
			flex-shrink: 0;
			gap: 0.35rem;
			padding: 0.35rem 0 0;
		}

		.page-nav-btn {
			min-height: 28px;
			padding: 0.2rem 0.5rem;
			font-size: 0.7rem;
		}

		.page-number {
			width: 26px;
			height: 26px;
			font-size: 0.72rem;
		}

		/* Bottom actions */
		.actions {
			flex-shrink: 0;
			margin-top: auto;
		}

		.actions :global(.ui-btn) {
			min-height: 38px;
			padding: 0.4rem 1.15rem;
			font-size: 0.84rem;
		}

		/* Mobile collapsible stats (show 1 row by default) */
		.kpi-secondary.kpi-collapsed {
			display: none;
		}

		.mastery-grid.mastery-collapsed {
			display: none;
		}

		/* Expand button and detail row in table */
		.col-expand {
			display: table-cell;
			width: 24px;
			text-align: center;
			padding: 0.6rem 0.2rem;
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
			font-size: 0.68rem;
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

		/* Guest card */
		.guest-card {
			padding: 1.5rem 1rem;
			gap: 0.65rem;
		}

		.guest-icon {
			font-size: 2rem;
		}

		.guest-title {
			font-size: 1.25rem;
		}

		.guest-desc {
			font-size: 0.82rem;
		}
	}
</style>
