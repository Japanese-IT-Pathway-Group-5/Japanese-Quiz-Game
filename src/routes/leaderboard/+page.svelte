<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const getLevelUrl = (level: string) => {
		return level === 'all'
			? '/leaderboard'
			: `/leaderboard?level=${level}`;
	};
</script>

<svelte:head>
	<title>Leaderboard</title>
	<meta
		name="description"
		content="Japanese Quiz Game leaderboard"
	/>
</svelte:head>

<div class="leaderboard-page">
	<div class="leaderboard-container">
		<header class="leaderboard-header">
			<h1>Leaderboard</h1>
			<p>See the best quiz scores and find your ranking.</p>
		</header>

		<nav class="level-filter" aria-label="Filter leaderboard by level">
			<a
				href={getLevelUrl('all')}
				class:active={data.level === 'all'}
			>
				All
			</a>

			<a
				href={getLevelUrl('N3')}
				class:active={data.level === 'N3'}
			>
				N3
			</a>

			<a
				href={getLevelUrl('N4')}
				class:active={data.level === 'N4'}
			>
				N4
			</a>
		</nav>

		{#if data.leaderboard.length === 0}
			<div class="empty-state">
				<h2>No scores yet</h2>
				<p>
					There are no finished quiz games for this level yet.
					Complete a quiz and be the first on the leaderboard!
				</p>
			</div>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Position</th>
							<th>Nickname</th>
							<th>Level</th>
							<th>Score</th>
							<th>Time</th>
						</tr>
					</thead>

					<tbody>
						{#each data.leaderboard as entry}
							<tr class:current-player={entry.isCurrentPlayer}>
								<td class="position">
									#{entry.position}
								</td>

								<td class="nickname">
									{entry.nickname}

									{#if entry.isCurrentPlayer}
										<span class="you">You</span>
									{/if}
								</td>

								<td>
									<span class="level">
										{entry.level}
									</span>
								</td>

								<td class="score">
									{entry.score}
								</td>

								<td class="time">
									{formatTime(entry.timeSeconds)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style>
	.leaderboard-page {
		min-height: 100vh;
		padding: 32px 16px;
		background: #f5f5f5;
	}

	.leaderboard-container {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
	}

	.leaderboard-header {
		margin-bottom: 24px;
	}

	h1 {
		margin: 0 0 8px;
		font-size: 32px;
	}

	.leaderboard-header p {
		margin: 0;
		color: #666;
	}

	.level-filter {
		display: flex;
		gap: 8px;
		margin-bottom: 20px;
	}

	.level-filter a {
		padding: 8px 18px;
		border: 1px solid #ccc;
		border-radius: 8px;
		background: white;
		color: #333;
		text-decoration: none;
		font-weight: 600;
	}

	.level-filter a:hover {
		background: #eee;
	}

	.level-filter a.active {
		background: #333;
		color: white;
		border-color: #333;
	}

	.table-wrapper {
		overflow-x: auto;
		border-radius: 10px;
		background: white;
		box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
	}

	table {
		width: 100%;
		min-width: 600px;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 14px 16px;
		text-align: left;
		border-bottom: 1px solid #eee;
	}

	th {
		background: #fafafa;
		font-size: 14px;
		color: #555;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr.current-player {
		background: #fff8d6;
	}

	.position {
		width: 100px;
		font-weight: 700;
	}

	.nickname {
		font-weight: 600;
	}

	.you {
		display: inline-block;
		margin-left: 8px;
		padding: 2px 7px;
		border-radius: 10px;
		background: #333;
		color: white;
		font-size: 11px;
		font-weight: 600;
	}

	.level {
		font-weight: 600;
	}

	.score {
		font-weight: 700;
	}

	.time {
		font-variant-numeric: tabular-nums;
	}

	.empty-state {
		padding: 48px 24px;
		border-radius: 10px;
		background: white;
		text-align: center;
		box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
	}

	.empty-state h2 {
		margin: 0 0 8px;
	}

	.empty-state p {
		max-width: 500px;
		margin: 0 auto;
		color: #666;
		line-height: 1.5;
	}

	@media (max-width: 600px) {
		.leaderboard-page {
			padding: 20px 10px;
		}

		h1 {
			font-size: 26px;
		}

		.level-filter {
			width: 100%;
		}

		.level-filter a {
			flex: 1;
			padding: 8px 12px;
			text-align: center;
		}

		th,
		td {
			padding: 12px;
		}
	}
</style>