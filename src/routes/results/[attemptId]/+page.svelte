<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
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

	const authError = $derived(page.url.searchParams.get('auth_error'));

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
		{#if authError}
			<div class="error-toast" role="alert">
				<i class="fa-solid fa-triangle-exclamation toast-icon"></i>
				<span>Sign-in was not completed. Your run remains saved anonymously.</span>
			</div>
		{/if}

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

		<!-- User & Account Status (Sleek Inline Design) -->
		{#if data.isSavedToAccount && data.player}
			<div class="player-status font-mono" role="region" aria-label="Account status">
				{#if data.player.avatarUrl}
					<img
						src={data.player.avatarUrl}
						alt=""
						class="player-avatar"
						referrerpolicy="no-referrer"
					/>
				{/if}
				<span class="player-name">{data.player.nickname}</span>
				<span class="player-dot">/</span>
				<span class="player-badge">
					<i class="fa-brands fa-google"></i>
					<span>Saved</span>
				</span>
				<span class="player-dot">/</span>
				<a href={resolve('/my-run')} class="player-myrun-link">
					<i class="fa-solid fa-user"></i>
					<span>My Runs</span>
				</a>
			</div>
		{:else}
			<div class="google-save-wrap" role="region" aria-label="Save run with Google">
				<a
					href="{resolve('/auth/google')}?attemptId={attempt.id}"
					class="google-btn"
					aria-label="Sign in with Google to save your run"
				>
					<svg class="google-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
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
					<span class="google-btn-text font-mono">Sign in with Google to save run</span>
				</a>
			</div>
		{/if}

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
		min-height: 100dvh;
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

	/* Toast Notifications */
	.error-toast {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.65rem;
		padding: 0.25rem 0;
		font-size: 0.88rem;
		font-weight: 600;
		background: transparent;
		border: none;
		color: #f87171;
		animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.toast-icon {
		font-size: 1.1rem;
		flex-shrink: 0;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Player Status (Inline, Seamless Footer-style) */
	.player-status {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		font-size: 0.85rem;
		color: var(--theme-text-muted, #94a3b8);
		padding: 0.25rem 0;
	}

	.player-avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		object-fit: cover;
	}

	.player-name {
		font-weight: 700;
		color: var(--theme-text-main, #ffffff);
	}

	.player-dot {
		color: rgba(255, 255, 255, 0.2);
		font-size: 0.8rem;
	}

	.player-badge {
		color: #4ade80;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.78rem;
		font-weight: 600;
	}

	.player-myrun-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--theme-gold, #ffbc0d);
		text-decoration: none;
		font-size: 0.82rem;
		font-weight: 600;
		transition:
			opacity 0.15s ease,
			color 0.15s ease;
	}

	.player-myrun-link:hover {
		opacity: 0.85;
		text-decoration: underline;
	}

	.google-save-wrap {
		display: flex;
		justify-content: center;
		margin: 0.35rem 0 0.15rem;
	}

	.google-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: #ffffff;
		color: #1f2937;
		padding: 0.8rem 1.6rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.92rem;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			background-color 0.15s ease;
		cursor: pointer;
	}

	.google-btn:hover {
		background: #f3f4f6;
		transform: translateY(-2px);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
	}

	.google-btn:active {
		transform: translateY(0);
	}

	.google-icon {
		flex-shrink: 0;
	}

	.google-btn-text {
		letter-spacing: 0.02em;
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

		.google-btn {
			padding: 0.65rem 1rem;
			font-size: 0.85rem;
		}
	}
</style>
