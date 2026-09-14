<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui';
	import SarcasticStickman from '$lib/components/SarcasticStickman.svelte';

	let { data }: { data: PageData } = $props();
	const attempt = $derived(data.attempt);
	const questionResults = $derived(data.questionResults ?? []);

	const totalQuestions = $derived(questionResults.length || (attempt.chosenQuestions ?? []).length);
	const accuracy = $derived(
		totalQuestions > 0 ? Math.round((attempt.correctCount / totalQuestions) * 100) : 0
	);
	const finalScore = $derived(attempt.finalScore ?? attempt.correctCount);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	// Dynamic sarcastic commentary based on accuracy (English only)
	const sarcasticRemark = $derived.by(() => {
		if (accuracy === 100) return "Perfect score! Are you sure you didn't cheat?";
		if (accuracy >= 80) return 'Not bad at all. Next time go for perfection!';
		if (accuracy >= 50) return 'Halfway there! Keep grinding your Japanese study!';
		return "Wait, were you serious? Let's try that again!";
	});
</script>

<svelte:head>
	<title>Results · 結果 · Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell">
	<div class="results-layout">
		<!-- Header Section -->
		<header class="header">
			<div class="header-stickman">
				<SarcasticStickman class="results-stickman" />
			</div>
			<h1 class="title font-brush text-gold-gradient">結果発表</h1>
			<p class="sarcastic-tag font-mono">{sarcasticRemark}</p>
		</header>

		<!-- Main Score Dashboard (No Box Container) -->
		<div class="score-showcase">
			<div class="score-badge-container">
				<span class="score-label font-mono">FINAL SCORE</span>
				<div class="score-number font-brush text-gold-gradient">{finalScore}</div>
				<span class="score-pts font-mono">/ 100 PTS</span>
			</div>

			<div class="stats-grid">
				<div class="stat-item">
					<span class="stat-label">Correct</span>
					<span class="stat-value font-mono">
						{attempt.correctCount} <span class="stat-sub">/ {totalQuestions}</span>
					</span>
				</div>

				<div class="stat-item">
					<span class="stat-label">Accuracy</span>
					<span class="stat-value font-mono">{accuracy}%</span>
				</div>

				<div class="stat-item">
					<span class="stat-label">Time</span>
					<span class="stat-value font-mono">{formatTime(data.timeTaken ?? 0)}</span>
				</div>

				<div class="stat-item">
					<span class="stat-label">Level</span>
					<span class="stat-value font-japanese">{attempt.level}</span>
				</div>
			</div>
		</div>

		<!-- 3 Action Buttons with Font Awesome Icons in 1 single row -->
		<div class="results-actions">
			<Button href={resolve('/')} variant="primary" size="md" fullWidth>
				<i class="fa-solid fa-rotate-right"></i>
				<span>Play Again</span>
			</Button>

			<Button href={resolve(`/review/${attempt.id}`)} variant="gold" size="md" fullWidth>
				<i class="fa-solid fa-magnifying-glass"></i>
				<span>Review</span>
			</Button>

			<Button href={resolve('/leaderboard')} variant="secondary" size="md" fullWidth>
				<i class="fa-solid fa-trophy"></i>
				<span>Leaderboard</span>
			</Button>
		</div>
	</div>
</div>

<style>
	.page-shell {
		min-height: 100vh;
		padding: 2.5rem 1rem 4rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.results-layout {
		width: min(100%, 680px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.header {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.header-stickman {
		margin-bottom: -0.5rem;
	}

	.header-stickman :global(.results-stickman) {
		width: 150px;
		height: 150px;
	}

	.title {
		margin: 0;
		font-size: clamp(2.4rem, 6vw, 3.4rem);
		font-weight: 900;
		letter-spacing: 0.06em;
		filter: drop-shadow(0 4px 18px rgba(0, 15, 45, 0.45));
	}

	.sarcastic-tag {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--theme-gold, #ffbc0d);
		max-width: 500px;
		line-height: 1.4;
	}

	/* Score Showcase (No Container) */
	.score-showcase {
		padding: 0.5rem 0;
		display: grid;
		gap: 1.25rem;
		text-align: center;
	}

	.score-badge-container {
		display: grid;
		gap: 0.2rem;
		justify-items: center;
	}

	.score-label {
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		color: var(--theme-gold, #ffbc0d);
		font-weight: 700;
	}

	.score-number {
		font-size: 4.6rem;
		font-weight: 900;
		line-height: 1;
		filter: drop-shadow(0 2px 14px rgba(255, 188, 13, 0.45));
	}

	.score-pts {
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		color: var(--theme-text-muted, #94a3b8);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		padding: 1.25rem 0;
		border-top: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
		border-bottom: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
	}

	.stat-item {
		display: grid;
		gap: 0.25rem;
	}

	.stat-label {
		font-size: 0.78rem;
		color: var(--theme-text-muted, #94a3b8);
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--theme-text-main, #ffffff);
	}

	.stat-sub {
		font-size: 0.85rem;
		font-weight: normal;
		color: var(--theme-text-muted, #94a3b8);
	}

	/* 3 Action Buttons in 1 single row */
	.results-actions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.85rem;
		margin-top: 0.5rem;
	}

	@media (max-width: 600px) {
		.page-shell {
			padding: 1.35rem 0.75rem 2rem;
		}

		.results-layout {
			gap: 1rem;
		}

		.header-stickman :global(.results-stickman) {
			width: 100px;
			height: 100px;
		}

		.title {
			font-size: 1.7rem;
		}

		.sarcastic-tag {
			font-size: 0.72rem;
		}

		.score-showcase {
			gap: 0.65rem;
		}

		.score-number {
			font-size: 3rem;
		}

		.score-label,
		.score-pts,
		.stat-label,
		.stat-sub {
			font-size: 0.62rem;
		}

		.stat-value {
			font-size: 0.88rem;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.75rem;
			padding: 0.75rem 0;
		}

		.results-actions {
			grid-template-columns: 1fr;
		}
	}
</style>
