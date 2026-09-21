<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData, ActionData } from './$types';
	import { Button } from '$lib/components/ui';
	import { scrollIntoViewOnKeyboard } from '$lib/actions/scrollIntoViewOnKeyboard.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const nickname = $derived(form?.nickname ?? data.nickname ?? '');
	let selectedLevel = $state('N4');
	let avatarFailed = $state(false);

	$effect(() => {
		if (form?.level) {
			selectedLevel = form.level;
		}
	});
</script>

<svelte:head>
	<title>Japanese Quiz Game · 日本語クイズ</title>
</svelte:head>

<div class="page-shell">
	<div class="start-canvas">
		<header class="hero">
			<h1 class="title font-brush text-gold-gradient">日本語クイズ</h1>
		</header>

		<form method="POST" class="quiz-form">
			{#if data.player?.googleId}
				<!-- Signed-In Player Banner -->
				<div class="field">
					<div class="field-label">
						<span>Player <span class="label-ja font-japanese">プレイヤー</span></span>
					</div>

					<div class="signed-in-banner">
						<div class="banner-player-info">
							{#if data.player.avatarUrl && !avatarFailed}
								<img
									src={data.player.avatarUrl}
									alt={data.player.nickname}
									class="banner-avatar"
									referrerpolicy="no-referrer"
									onerror={() => (avatarFailed = true)}
								/>
							{:else}
								<div class="banner-avatar-fallback font-japanese">
									{data.player.nickname?.[0] ?? '学'}
								</div>
							{/if}

							<div class="banner-text">
								<div class="banner-name-row">
									<span class="banner-name">{data.player.nickname}</span>
									<span class="banner-tag font-mono">
										<i class="fa-brands fa-google"></i>
										<span>GOOGLE</span>
									</span>
								</div>
								{#if data.player.email}
									<span class="banner-email font-mono">{data.player.email}</span>
								{/if}
							</div>
						</div>

						<Button href={resolve('/auth/logout')} variant="primary" size="sm">
							<i class="fa-solid fa-arrow-right-from-bracket"></i>
							<span>Sign out</span>
						</Button>

						<input type="hidden" name="nickname" value={nickname} />
					</div>
				</div>
			{:else}
				<!-- Guest / Anonymous Nickname Input -->
				<div class="field">
					<label class="field-label" for="nickname">
						<span>Nickname <span class="label-ja font-japanese">名前</span></span>
					</label>
					<input
						id="nickname"
						use:scrollIntoViewOnKeyboard
						name="nickname"
						type="text"
						class="input-text nickname-input"
						maxlength="30"
						value={nickname}
						autocomplete="nickname"
						placeholder="Enter your name (e.g. Kenji, さくら)"
						required
					/>
				</div>
			{/if}

			<div class="field">
				<span class="field-label">
					<span>Level <span class="label-ja font-japanese">難易度</span></span>
				</span>
				<div class="level-segmented" role="radiogroup" aria-label="Choose quiz level">
					<label class="level-segment {selectedLevel === 'N4' ? 'active' : ''}">
						<input type="radio" name="level" value="N4" bind:group={selectedLevel} />
						<span class="segment-title font-japanese">N4 初級</span>
						<span class="segment-desc">Elementary grammar & vocabulary</span>
					</label>

					<label class="level-segment {selectedLevel === 'N3' ? 'active' : ''}">
						<input type="radio" name="level" value="N3" bind:group={selectedLevel} />
						<span class="segment-title font-japanese">N3 中級</span>
						<span class="segment-desc">Intermediate nuances & patterns</span>
					</label>
				</div>
			</div>

			{#if form?.error}
				<div class="error-banner" role="alert">
					<span>{form.error}</span>
				</div>
			{/if}

			<button type="submit" class="start-btn" aria-label="Start Quiz">
				<img src="/images/start-button.webp" alt="Start Quiz" class="start-btn-img" />
			</button>
		</form>

		<footer class="footer-nav">
			<a href={resolve('/leaderboard')} class="nav-item font-mono">
				<i class="fa-solid fa-ranking-star"></i>
				<span>LEADERBOARD</span>
			</a>
			<span class="nav-dot">/</span>
			<a href={resolve('/my-run')} class="nav-item font-mono">
				<i class="fa-solid fa-user"></i>
				<span>MY RUNS</span>
			</a>
			<span class="nav-dot">/</span>
			<a href={resolve('/credits')} class="nav-item font-mono">
				<i class="fa-solid fa-people-group"></i>
				<span>CREDITS</span>
			</a>
		</footer>
	</div>
</div>

<style>
	.start-canvas {
		width: min(100%, 480px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.hero {
		position: relative;
		z-index: 4;
		text-align: center;
		padding: clamp(3.5rem, 10vw, 5rem) 0 0.5rem;
	}
	.title {
		margin: 0;
		font-size: clamp(2.6rem, 7vw, 3.6rem);
		font-weight: 900;
		letter-spacing: 0.08em;
		line-height: 1.15;
		filter: drop-shadow(0 4px 18px rgba(0, 15, 45, 0.45));
	}

	.quiz-form {
		display: grid;
		gap: 1.6rem;
	}

	.field {
		display: grid;
		gap: 0.55rem;
	}

	.field-label {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 0.92rem;
		color: var(--theme-text-main);
	}

	.label-ja {
		font-size: 0.8rem;
		font-weight: normal;
		color: var(--theme-text-muted);
		margin-left: 0.35rem;
	}

	/* Signed-In Player Info (Containerless) */
	.signed-in-banner {
		background: transparent;
		border: none;
		padding: 0.15rem 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.85rem;
	}

	.banner-player-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.banner-avatar {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		object-fit: cover;
		background: #1f2937;
		flex-shrink: 0;
	}

	.banner-avatar-fallback {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: var(--theme-gold, #ffbc0d);
		color: #0b0f19;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 900;
		flex-shrink: 0;
	}

	.banner-text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.banner-name-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.banner-name {
		font-size: 1rem;
		font-weight: 800;
		color: var(--theme-text-main, #ffffff);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.banner-tag {
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--theme-gold, #ffbc0d);
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		letter-spacing: 0.04em;
	}

	.banner-email {
		font-size: 0.7rem;
		color: var(--theme-text-muted, #94a3b8);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nickname-input {
		box-shadow: 0 4px 14px rgba(0, 15, 45, 0.25);
	}

	/* Metallic Segmented Level Picker */
	.level-segmented {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.level-segment {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.95rem 1.15rem;
		border-radius: var(--radius-md);
		background: var(--theme-paper);
		border: 1px solid var(--theme-border);
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		position: relative;
		overflow: hidden;
		box-shadow: 0 4px 14px rgba(0, 15, 45, 0.25);
	}

	.level-segment input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	/* Metallic shine sweep light effect */
	.level-segment::after {
		content: '';
		position: absolute;
		top: 0;
		left: -140%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			115deg,
			transparent 0%,
			rgba(255, 255, 255, 0.03) 25%,
			rgba(255, 255, 255, 0.45) 50%,
			rgba(255, 255, 255, 0.03) 75%,
			transparent 100%
		);
		transform: skewX(-25deg);
		transition: left 1.1s ease-out;
		pointer-events: none;
		z-index: 2;
	}

	.level-segment:hover::after {
		left: 150%;
		transition: left 3.4s cubic-bezier(0.2, 0.8, 0.25, 1);
	}

	/* Blue Hover State (Unselected) */
	.level-segment:hover:not(.active) {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
	}

	.level-segment:hover:not(.active) .segment-title {
		color: #ffffff;
	}

	.level-segment:hover:not(.active) .segment-desc {
		color: color-mix(in srgb, var(--theme-text-muted) 85%, #ffffff 15%);
	}

	/* Selected / Active State */
	.level-segment.active {
		background: var(--theme-gold-shimmer);
		border-color: var(--theme-gold);
		color: #022659;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
		transform: translateY(-2px);
	}

	.level-segment.active:hover {
		filter: brightness(1.05);
	}

	.segment-title {
		font-size: 1.02rem;
		font-weight: 700;
		color: var(--theme-text-main);
		transition: color 0.15s ease;
		position: relative;
		z-index: 1;
	}

	.level-segment.active .segment-title {
		color: #022659;
		font-weight: 800;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.segment-desc {
		font-size: 0.76rem;
		line-height: 1.35;
		color: var(--theme-text-muted);
		transition: color 0.15s ease;
		position: relative;
		z-index: 1;
	}

	.level-segment.active .segment-desc {
		color: rgba(2, 38, 89, 0.9);
		font-weight: 600;
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

	.start-btn {
		background: transparent;
		border: none;
		padding: 0.25rem 0;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		position: relative;
		border-radius: var(--radius-md);
		transition:
			transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.2s ease;
	}

	.start-btn:hover {
		transform: translateY(-2px) scale(1.02);
		filter: brightness(1.08);
	}

	.start-btn:active {
		transform: translateY(0.5px) scale(0.99);
		filter: brightness(0.98);
	}

	.start-btn:focus-visible {
		outline: 2px solid var(--theme-gold);
		outline-offset: 4px;
	}

	.start-btn-img {
		display: block;
		width: min(100%, 250px);
		height: auto;
		aspect-ratio: 1744 / 502;
		object-fit: contain;
		user-select: none;
		pointer-events: none;
	}

	.footer-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding-top: 0.5rem;
	}

	.nav-item {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		color: var(--theme-text-muted);
		text-decoration: none;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		padding: 0.35rem 0.65rem;
		border-radius: var(--radius-sm);
	}

	.nav-item:hover {
		color: var(--theme-gold);
		background: rgba(255, 188, 13, 0.12);
		transform: translateY(-1px);
	}

	.nav-item:active {
		transform: translateY(1px) scale(0.97);
	}

	.nav-dot {
		color: var(--theme-border-strong);
		font-size: 0.75rem;
		opacity: 0.5;
	}

	@media (max-width: 640px) {
		.page-shell {
			height: 100dvh;
			min-height: 0;
			padding: 0.7rem;
			overflow: hidden;
		}

		.start-canvas {
			gap: 0.7rem;
		}

		.title {
			font-size: 1.85rem;
		}

		.field-label {
			font-size: 0.7rem;
		}

		.level-segmented {
			grid-template-columns: 1fr;
			gap: 0.45rem;
		}

		.level-segment {
			gap: 0.15rem;
			padding: 0.58rem 0.7rem;
		}

		.segment-title {
			font-size: 0.78rem;
		}

		.segment-desc,
		.error-banner,
		.nav-item {
			font-size: 0.62rem;
		}

		.start-btn-img {
			width: min(100%, 175px);
		}

		.footer-nav {
			gap: 0.35rem;
			padding-top: 0.2rem;
		}
	}
</style>
