<script lang="ts">
	import { resolve } from '$app/paths';
	import { teamMembers } from '$lib/credits';
	import TeamPhoto from '$lib/components/TeamPhoto.svelte';
	import { Button } from '$lib/components/ui';
	import { replayHoverClip, stopHoverClip } from '$lib/audio/hoverClip';

	let activeMemberId: string | null = $state(null);
	let detailsOpen = $state(false);

	let activeMember = $derived(teamMembers.find((m) => m.id === activeMemberId) || null);

	function handleHover(id: string | null) {
		activeMemberId = id;

		if (id) {
			replayHoverClip();
		} else {
			stopHoverClip();
		}
	}

	function selectMember(id: string) {
		activeMemberId = id;
		detailsOpen = true;
	}

	function closeDetails() {
		detailsOpen = false;
	}
</script>

<svelte:head>
	<title>Credits · 制作チーム · Japanese Quiz Game</title>
</svelte:head>

<div class="team-page">
	<div class="team-shell">
		<header class="team-header">
			<p class="eyebrow">GROUP 5</p>
			<h1>開発チーム紹介</h1>
			<p class="intro">日本語クイズゲームを一緒につくった開発チームです。</p>
		</header>

		<main class="team-main">
			<section class="photo-section" aria-labelledby="members-heading">
				<div class="photo-card">
					<TeamPhoto
						members={teamMembers}
						bind:activeMemberId
						onselect={selectMember}
						onhover={handleHover}
					/>
				</div>

				<div class="member-guide">
					<div class="guide-icon" aria-hidden="true">
						<i class="fa-solid fa-users"></i>
					</div>

					<div>
						<h2 id="members-heading">メンバー紹介</h2>
						<p>メンバーをタップすると、担当と貢献内容を確認できます。</p>
					</div>
				</div>
			</section>

			<aside class="desktop-details" aria-live="polite">
				{#if activeMember}
					<div class="details-card">
						<div class="details-top">
							<span class="member-japanese">
								{activeMember.katakanaName || activeMember.name}
							</span>
							<h2>{activeMember.name}</h2>
							<p>{activeMember.role}</p>
						</div>

						<div class="details-divider"></div>

						<section>
							<h3>
								<i class="fa-solid fa-code" aria-hidden="true"></i>
								CONTRIBUTIONS
							</h3>

							<ul>
								{#each activeMember.contributions as contribution (contribution)}
									<li>{contribution}</li>
								{/each}
							</ul>
						</section>
					</div>
				{:else}
					<div class="details-card empty-details">
						<div class="empty-icon" aria-hidden="true">
							<i class="fa-solid fa-user-group"></i>
						</div>
						<h2>メンバーを選択</h2>
						<p>写真のメンバーをタップすると、担当と貢献内容を表示します。</p>
					</div>
				{/if}
			</aside>
		</main>

		<footer class="team-footer">
			<Button href={resolve('/')} variant="gold" size="md">
				<i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
				<span>ホームへ戻る</span>
			</Button>
		</footer>
	</div>
</div>

{#if detailsOpen && activeMember}
	<div class="mobile-backdrop" role="presentation" onclick={closeDetails}>
		<div class="mobile-sheet" role="dialog" aria-modal="true" aria-labelledby="mobile-member-name">
			<div class="sheet-handle" aria-hidden="true"></div>

			<button
				class="close-button"
				type="button"
				aria-label="メンバー詳細を閉じる"
				onclick={closeDetails}
			>
				<i class="fa-solid fa-xmark" aria-hidden="true"></i>
			</button>

			<span class="member-japanese">
				{activeMember.katakanaName || activeMember.name}
			</span>

			<h2 id="mobile-member-name">{activeMember.name}</h2>
			<p class="sheet-role">{activeMember.role}</p>

			<div class="details-divider"></div>

			<section>
				<h3>
					<i class="fa-solid fa-code" aria-hidden="true"></i>
					CONTRIBUTIONS
				</h3>

				<ul>
					{#each activeMember.contributions as contribution (contribution)}
						<li>{contribution}</li>
					{/each}
				</ul>
			</section>
		</div>
	</div>
{/if}

<style>
	.team-page {
		min-height: 100dvh;
		padding: clamp(1.25rem, 4vw, 2.5rem) 1rem max(2rem, env(safe-area-inset-bottom));
		color: #f8fafc;
		background: transparent;
	}

	.team-shell {
		width: min(100%, 1120px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: clamp(1.25rem, 3vw, 2rem);
	}

	.team-header {
		position: relative;
		isolation: isolate;
		width: min(100%, 720px);
		margin: 0 auto;
		padding: 0.35rem 0.75rem 0.55rem;
		text-align: center;
	}

	.team-header::before {
		content: '';
		position: absolute;
		inset: -0.5rem -1rem;
		z-index: -1;
		background: radial-gradient(
			ellipse at center,
			rgba(8, 12, 20, 0.48) 0%,
			rgba(8, 12, 20, 0.24) 45%,
			rgba(8, 12, 20, 0) 75%
		);
		filter: blur(8px);
	}

	.team-header .eyebrow {
		margin: 0 0 0.35rem;
		color: #fff4c2;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.2em;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.75);
	}

	.team-header h1 {
		margin: 0;
		color: #ffffff;
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: clamp(1.4rem, 5vw, 1.85rem);
		font-weight: 800;
		line-height: 1.35;
		letter-spacing: 0.04em;
		text-shadow:
			0 1px 4px rgba(0, 0, 0, 0.85),
			0 2px 10px rgba(0, 0, 0, 0.45);
	}

	.intro {
		margin: 0.55rem auto 0;
		max-width: 100%;
		color: #ffffff;
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: 0.9rem;
		font-weight: 600;
		line-height: 1.6;
		overflow-wrap: anywhere;
		text-shadow:
			0 1px 4px rgba(0, 0, 0, 0.9),
			0 2px 10px rgba(0, 0, 0, 0.5);
	}

	.team-main {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.7fr);
		align-items: start;
		gap: clamp(1rem, 3vw, 2rem);
	}

	.photo-section {
		min-width: 0;
	}

	.photo-card {
		width: 100%;
		min-width: 0;
		padding: clamp(0.45rem, 1.5vw, 0.75rem);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 1.25rem;
		background: rgba(16, 24, 39, 0.55);
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
	}

	/* Keep the complete 1280 × 953 team image visible without cropping. */
	.photo-card :global(.team-photo-wrapper),
	.photo-card :global(.photo-frame) {
		width: 100%;
		max-width: 100%;
	}

	.photo-card :global(.photo-frame) {
		aspect-ratio: 1280 / 953;
	}

	.member-guide {
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		margin-top: 0.9rem;
		padding: 0 0.2rem;
	}

	.member-guide::before {
		content: '';
		position: absolute;
		inset: -0.35rem -0.5rem;
		z-index: -1;
		background: radial-gradient(
			ellipse at center,
			rgba(0, 0, 0, 0.38) 0%,
			rgba(0, 0, 0, 0.18) 45%,
			transparent 75%
		);
		pointer-events: none;
	}

	.guide-icon {
		flex: 0 0 auto;
		width: 2.35rem;
		height: 2.35rem;
		display: grid;
		place-items: center;
		border: 1px solid rgba(245, 200, 76, 0.35);
		border-radius: 0.7rem;
		color: #f5c84c;
		background: rgba(16, 24, 39, 0.8);
	}

	.member-guide > div:last-child {
		position: relative;
		z-index: 1;
		min-width: 0;
	}

	.member-guide h2 {
		margin: 0;
		color: #ffffff;
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: 1.12rem;
		font-weight: 700;
		line-height: 1.4;
		text-shadow: 0 2px 5px rgba(0, 0, 0, 0.65);
	}

	.member-guide p {
		margin: 0.2rem 0 0;
		color: rgba(255, 255, 255, 0.92);
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: 0.82rem;
		font-weight: 500;
		line-height: 1.6;
		overflow-wrap: anywhere;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
	}

	.desktop-details {
		min-width: 0;
	}

	.details-card {
		width: 100%;
		min-height: 100%;
		padding: clamp(1rem, 2.5vw, 1.4rem);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 1rem;
		background: #101827;
		box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
	}

	.details-top {
		min-width: 0;
	}

	.member-japanese {
		display: block;
		margin-bottom: 0.25rem;
		color: #f5c84c;
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: 0.82rem;
		font-weight: 700;
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	.details-card h2,
	.mobile-sheet h2 {
		margin: 0;
		color: #f8fafc;
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: clamp(1.2rem, 2.5vw, 1.5rem);
		font-weight: 800;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.details-top p,
	.sheet-role {
		margin: 0.35rem 0 0;
		color: #94a3b8;
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1.55;
		overflow-wrap: anywhere;
	}

	.details-divider {
		height: 1px;
		margin: 1rem 0;
		background: rgba(255, 255, 255, 0.12);
	}

	.details-card h3,
	.mobile-sheet h3 {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0 0 0.7rem;
		color: #f5c84c;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.1em;
	}

	.details-card ul,
	.mobile-sheet ul {
		margin: 0;
		padding-left: 1.15rem;
		color: #f8fafc;
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: 0.88rem;
		line-height: 1.6;
	}

	.details-card li + li,
	.mobile-sheet li + li {
		margin-top: 0.5rem;
	}

	.empty-details {
		min-height: 360px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.empty-icon {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		margin-bottom: 0.8rem;
		border: 1px solid rgba(245, 200, 76, 0.3);
		border-radius: 50%;
		color: #f5c84c;
		background: rgba(245, 200, 76, 0.08);
	}

	.empty-details h2 {
		font-size: 1.15rem;
	}

	.empty-details p {
		max-width: 270px;
		margin: 0.5rem 0 0;
		color: #94a3b8;
		font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
		font-size: 0.85rem;
		line-height: 1.6;
	}

	.team-footer {
		display: flex;
		justify-content: center;
		padding-top: 0.1rem;
	}

	.team-footer :global(a),
	.team-footer :global(button) {
		min-height: 2.75rem;
	}

	.mobile-backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: 0;
		background: rgba(0, 0, 0, 0.62);
		backdrop-filter: blur(5px);
		animation: fade-in 0.2s ease;
	}

	.mobile-sheet {
		position: relative;
		width: min(100%, 620px);
		max-height: min(82dvh, 680px);
		overflow-y: auto;
		padding: 1.4rem 1.1rem max(1.4rem, env(safe-area-inset-bottom));
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-bottom: 0;
		border-radius: 1.25rem 1.25rem 0 0;
		background: #101827;
		box-shadow: 0 -16px 40px rgba(0, 0, 0, 0.35);
		animation: sheet-up 0.22s ease;
	}

	.sheet-handle {
		width: 2.75rem;
		height: 0.25rem;
		margin: -0.3rem auto 1rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.25);
	}

	.close-button {
		position: absolute;
		top: 0.9rem;
		right: 0.9rem;
		width: 2.75rem;
		height: 2.75rem;
		display: grid;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 50%;
		color: #f8fafc;
		background: rgba(255, 255, 255, 0.06);
		cursor: pointer;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.close-button:focus-visible {
		outline: 2px solid #f5c84c;
		outline-offset: 2px;
	}

	.mobile-sheet .member-japanese {
		padding-right: 3.25rem;
	}

	.mobile-sheet h2 {
		padding-right: 3rem;
		font-size: 1.3rem;
	}

	.mobile-sheet section {
		min-width: 0;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes sheet-up {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0);
		}
	}

	@media (max-width: 860px) {
		.team-main {
			grid-template-columns: 1fr;
		}

		.desktop-details {
			display: none;
		}
	}

	@media (min-width: 861px) {
		.mobile-backdrop {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.team-page {
			padding-inline: 0.65rem;
		}

		.team-shell {
			gap: 1.1rem;
		}

		.team-header h1 {
			font-size: 1.35rem;
		}

		.intro {
			font-size: 0.82rem;
		}

		.photo-card {
			padding: 0.3rem;
			border-radius: 1rem;
		}

		.member-guide {
			gap: 0.6rem;
			margin-top: 0.75rem;
		}

		.guide-icon {
			width: 2.15rem;
			height: 2.15rem;
		}

		.member-guide h2 {
			font-size: 0.98rem;
		}

		.member-guide p {
			font-size: 0.78rem;
		}
	}

	@media (max-width: 360px) {
		.team-page {
			padding-inline: 0.5rem;
		}

		.team-header h1 {
			font-size: 1.25rem;
		}

		.member-guide {
			align-items: flex-start;
		}

		.mobile-sheet {
			padding-inline: 0.9rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-backdrop,
		.mobile-sheet {
			animation: none;
		}
	}
</style>
