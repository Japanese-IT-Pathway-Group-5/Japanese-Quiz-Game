<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui';

	let { data }: { data: PageData } = $props();
	const attempt = $derived(data.attempt);
	const questionResults = $derived(data.questionResults ?? []);
	const totalQuestions = $derived(questionResults.length || (attempt.chosenQuestions ?? []).length);

	let selectedIndex = $state(0);
	let scrollContainer: HTMLElement | null = $state(null);

	const activeQuestion = $derived(questionResults[selectedIndex] ?? questionResults[0] ?? null);

	function selectQuestionByIndex(idx: number) {
		if (idx >= 0 && idx < questionResults.length) {
			selectedIndex = idx;
		}
	}

	function goNextReview() {
		if (selectedIndex < questionResults.length - 1) {
			selectedIndex++;
		}
	}

	function goPrevReview() {
		if (selectedIndex > 0) {
			selectedIndex--;
		}
	}

	function handleReviewKeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement | null;

		if (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement ||
			target?.isContentEditable
		) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goPrevReview();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			goNextReview();
		}
	}

	$effect(() => {
		// Reset inner scroll position when switching questions
		if (selectedIndex !== undefined && scrollContainer) {
			scrollContainer.scrollTop = 0;
		}

		window.addEventListener('keydown', handleReviewKeydown);

		return () => {
			window.removeEventListener('keydown', handleReviewKeydown);
		};
	});
</script>

<svelte:head>
	<title>Review Answers · 解答確認 · Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell">
	<div class="review-layout">
		<!-- Main Review Two-Column Section -->
		{#if questionResults.length > 0}
			<section class="review-panels-container">
				<!-- Left Sidebar: Square Question Tiles Grid -->
				<aside class="review-sidebar">
					<div class="tracker-top">
						<span class="tracker-title font-mono">QUESTIONS</span>
						<span class="tracker-count font-mono">{attempt.correctCount}/{totalQuestions}</span>
					</div>

					<!-- Clean 5x2 Square Grid -->
					<div class="review-grid">
						{#each questionResults as q, idx (q.questionId)}
							{@const isSelected = selectedIndex === idx}
							<button
								type="button"
								class="grid-tile font-mono {isSelected ? 'active' : ''} {q.isCorrect
									? 'is-correct'
									: 'is-wrong'}"
								onclick={() => selectQuestionByIndex(idx)}
								title={`Question ${idx + 1} (${q.isCorrect ? 'Correct' : 'Incorrect'})`}
							>
								<span class="tile-number">{idx + 1}</span>
								<span class="tile-icon">
									{#if q.isCorrect}
										<i class="fa-solid fa-check"></i>
									{:else}
										<i class="fa-solid fa-xmark"></i>
									{/if}
								</span>
							</button>
						{/each}
					</div>
				</aside>

				<!-- Right Main Inspection Card with Locked Stable Height -->
				{#if activeQuestion}
					<main class="review-main-card">
						<!-- Card Header (Pinned Top) -->
						<div class="inspection-header">
							<div class="inspection-tags">
								<span class="q-index-tag font-mono">Q{selectedIndex + 1}</span>
								<span class="format-label font-mono">
									{#if activeQuestion.format === 'multiple_choice'}
										<i class="fa-solid fa-list-check"></i>
										<span>Multiple Choice</span>
									{:else if activeQuestion.format === 'gap_fill'}
										<i class="fa-solid fa-pen-to-square"></i>
										<span>Gap Fill</span>
									{:else if activeQuestion.format === 'word_ordering'}
										<i class="fa-solid fa-arrow-down-a-z"></i>
										<span>Word Ordering</span>
									{:else if activeQuestion.format === 'typing'}
										<i class="fa-solid fa-keyboard"></i>
										<span>Typing</span>
									{/if}
								</span>
							</div>

							<div
								class="inspection-status {activeQuestion.isCorrect ? 'correct' : 'wrong'} font-mono"
							>
								{#if activeQuestion.isCorrect}
									<i class="fa-solid fa-circle-check"></i>
									<span>CORRECT</span>
								{:else}
									<i class="fa-solid fa-circle-xmark"></i>
									<span>INCORRECT</span>
								{/if}
							</div>
						</div>

						<!-- Scrollable Inner Content Area -->
						<div class="inspection-scroll-area custom-scrollbar" bind:this={scrollContainer}>
							<!-- Japanese Prompt Display -->
							<div class="inspection-prompt">
								<h2 class="japanese-prompt font-japanese">
									{activeQuestion.promptJa ?? activeQuestion.prompt}
								</h2>
								{#if activeQuestion.promptJa && activeQuestion.prompt && activeQuestion.prompt !== activeQuestion.promptJa}
									<p class="english-subprompt">{activeQuestion.prompt}</p>
								{/if}
							</div>

							<!-- Answers Display (No Container) -->
							<div class="answers-content">
								<!-- Player's Answer -->
								<div
									class="answer-section {activeQuestion.isCorrect ? 'ans-correct' : 'ans-wrong'}"
								>
									<div class="ans-heading font-mono">
										<i class="fa-solid {activeQuestion.isCorrect ? 'fa-check' : 'fa-xmark'}"></i>
										<span>YOUR ANSWER</span>
									</div>
									<div class="ans-value font-japanese">
										{activeQuestion.answer || '(No answer provided)'}
									</div>
								</div>

								<!-- Correct Answer -->
								{#if !activeQuestion.isCorrect || activeQuestion.correctAnswers.length > 0}
									<div class="answer-section ans-solution">
										<div class="ans-heading font-mono">
											<i class="fa-solid fa-check-double"></i>
											<span>CORRECT ANSWER</span>
										</div>
										<div class="ans-value font-japanese ans-solution-text">
											{activeQuestion.correctAnswers.join(' / ') || 'N/A'}
										</div>
									</div>
								{/if}
							</div>

							<!-- Educational Explanation (No Container) -->
							{#if activeQuestion.explanation}
								<div class="explanation-section">
									<div class="explanation-heading font-mono">
										<i class="fa-solid fa-lightbulb"></i>
										<span>EXPLANATION</span>
									</div>
									<p class="explanation-body">
										{activeQuestion.explanation}
									</p>
								</div>
							{/if}
						</div>

						<!-- Card Navigation Footer (Pinned Bottom) -->
						<div class="inspection-nav">
							<button
								type="button"
								class="inspect-nav-btn font-mono"
								disabled={selectedIndex === 0}
								onclick={goPrevReview}
							>
								<i class="fa-solid fa-arrow-left"></i>
								<span>Previous</span>
							</button>

							<span class="inspect-counter font-mono">
								{selectedIndex + 1} / {totalQuestions}
							</span>

							<button
								type="button"
								class="inspect-nav-btn font-mono"
								disabled={selectedIndex === questionResults.length - 1}
								onclick={goNextReview}
							>
								<span>Next</span>
								<i class="fa-solid fa-arrow-right"></i>
							</button>
						</div>
					</main>
				{/if}
			</section>
		{/if}

		<!-- Bottom Action Buttons in 1 Row with Icons -->
		<div class="review-actions">
			<Button href={resolve(`/results/${attempt.id}`)} variant="secondary" size="md" fullWidth>
				<i class="fa-solid fa-arrow-left"></i>
				<span>Results</span>
			</Button>

			<Button href={resolve('/')} variant="primary" size="md" fullWidth>
				<i class="fa-solid fa-rotate-right"></i>
				<span>Play Again</span>
			</Button>

			<Button href={resolve('/leaderboard')} variant="gold" size="md" fullWidth>
				<i class="fa-solid fa-trophy"></i>
				<span>Leaderboard</span>
			</Button>
		</div>
	</div>
</div>

<style>
	.page-shell {
		min-height: 100dvh;
		padding: 2.5rem 1rem 3.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
	}

	.review-layout {
		width: min(100%, 860px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.35rem;
		box-sizing: border-box;
	}

	/* Two-Column Review Layout */
	.review-panels-container {
		display: grid;
		grid-template-columns: 190px 1fr;
		gap: 1.35rem;
		align-items: start;
	}

	/* Left Sidebar Tracker */
	.review-sidebar {
		background: transparent;
		border: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tracker-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-bottom: 0.15rem;
	}

	.tracker-title {
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		color: var(--theme-text-muted);
	}

	.tracker-count {
		font-size: 0.85rem;
		font-weight: 800;
		color: var(--theme-gold);
	}

	/* Clean 5x2 Square Grid */
	.review-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.45rem;
	}

	.grid-tile {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 2.2rem;
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-sm);
		background: var(--theme-paper);
		color: var(--theme-text-muted);
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 2px 6px rgba(0, 15, 45, 0.2);
		user-select: none;
	}

	.grid-tile::after {
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

	.grid-tile:hover::after {
		left: 150%;
		transition: left 3.4s cubic-bezier(0.2, 0.8, 0.25, 1);
	}

	.grid-tile:hover:not(.active) {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		border-color: rgba(255, 188, 13, 0.45);
		color: #ffffff;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 20, 60, 0.35);
	}

	.grid-tile.active {
		background: var(--theme-gold-shimmer);
		border-color: var(--theme-gold);
		color: #022659;
		box-shadow: 0 4px 12px rgba(255, 188, 13, 0.35);
		transform: translateY(-2px);
	}

	.grid-tile.active:hover {
		filter: brightness(1.05);
	}

	.tile-number {
		font-size: 0.85rem;
		font-weight: 800;
		line-height: 1;
		position: relative;
		z-index: 1;
	}

	.grid-tile.active .tile-number {
		color: #022659;
		font-weight: 900;
	}

	.tile-icon {
		font-size: 0.55rem;
		line-height: 1;
		margin-top: 0.15rem;
		position: relative;
		z-index: 1;
	}

	.grid-tile.is-correct .tile-icon {
		color: #22c55e;
	}

	.grid-tile.is-wrong .tile-icon {
		color: #ef4444;
	}

	.grid-tile.active.is-correct .tile-icon {
		color: #065f46;
	}

	.grid-tile.active.is-wrong .tile-icon {
		color: #991b1b;
	}

	/* Right Main Inspection Card - Locked Stable Height */
	.review-main-card {
		background: var(--theme-paper);
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-lg, 0.75rem);
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		height: 450px;
		min-height: 450px;
		max-height: 450px;
		box-shadow: 0 4px 18px rgba(0, 15, 45, 0.25);
		box-sizing: border-box;
		overflow: hidden;
	}

	.inspection-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.65rem;
		border-bottom: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
		flex-shrink: 0;
	}

	.inspection-tags {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.q-index-tag {
		font-size: 1.1rem;
		font-weight: 900;
		color: var(--theme-gold, #ffbc0d);
	}

	/* Question Type without Container */
	.format-label {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--theme-text-muted, #94a3b8);
		display: flex;
		align-items: center;
		gap: 0.45rem;
		background: none;
		border: none;
		padding: 0;
	}

	.format-label i {
		color: var(--theme-gold, #ffbc0d);
		font-size: 0.85rem;
	}

	.inspection-status {
		font-size: 0.85rem;
		font-weight: 800;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: transparent;
		border: none;
		padding: 0;
	}

	.inspection-status.correct {
		color: #22c55e;
	}

	.inspection-status.wrong {
		color: #ef4444;
	}

	/* Scrollable Inner Area */
	.inspection-scroll-area {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.95rem;
		padding: 0.75rem 0.25rem 0.75rem 0;
	}

	/* Sleek Custom Scrollbar */
	.custom-scrollbar::-webkit-scrollbar {
		width: 5px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.15);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 188, 13, 0.35);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: var(--theme-gold, #ffbc0d);
	}
	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 188, 13, 0.35) rgba(0, 0, 0, 0.15);
	}

	.inspection-prompt {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		flex-shrink: 0;
	}

	.japanese-prompt {
		margin: 0;
		font-size: clamp(1.2rem, 2vw, 1.45rem);
		font-weight: 700;
		line-height: 1.45;
		color: var(--theme-text-main, #ffffff);
	}

	.english-subprompt {
		margin: 0;
		font-size: 0.88rem;
		color: var(--theme-text-muted, #94a3b8);
	}

	/* Answers Display without Sub-Containers */
	.answers-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 1.15rem;
		flex-shrink: 0;
	}

	.answer-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		background: none;
		border: none;
		padding: 0;
		box-shadow: none;
	}

	.ans-heading {
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.ans-correct .ans-heading {
		color: #22c55e;
	}

	.ans-wrong .ans-heading {
		color: #ef4444;
	}

	.ans-solution .ans-heading {
		color: var(--theme-gold, #ffbc0d);
	}

	.ans-value {
		font-size: 1.12rem;
		font-weight: 700;
		color: var(--theme-text-main);
	}

	.ans-wrong .ans-value {
		color: #f87171;
	}

	.ans-solution-text {
		color: var(--theme-gold, #ffbc0d);
	}

	/* Educational Explanation without Container */
	.explanation-section {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		background: none;
		border: none;
		padding: 0.2rem 0;
		box-shadow: none;
	}

	.explanation-heading {
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--theme-gold, #ffbc0d);
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.explanation-body {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--theme-text-main, #f1f5f9);
	}

	/* Card Footer Navigation - Pinned at bottom */
	.inspection-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.65rem;
		border-top: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
		flex-shrink: 0;
		margin-top: auto;
	}

	.inspect-nav-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.95rem;
		border-radius: var(--radius-sm);
		background: var(--theme-paper);
		border: 1px solid var(--theme-border);
		color: var(--theme-text-main, #ffffff);
		font-size: 0.82rem;
		font-weight: 700;
		cursor: pointer;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
		box-shadow: 0 1px 4px rgba(0, 15, 45, 0.15);
	}

	.inspect-nav-btn:hover:not(:disabled) {
		background: color-mix(in srgb, var(--theme-paper) 80%, #1952a8 20%);
		color: #ffffff;
	}

	.inspect-nav-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		box-shadow: none;
	}

	.inspect-counter {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--theme-text-muted, #94a3b8);
	}

	/* Review Action Buttons in 1 single row */
	.review-actions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.85rem;
		margin-top: 0.25rem;
	}

	@media (max-width: 768px) {
		.review-panels-container {
			grid-template-columns: 1fr;
		}

		.review-main-card {
			height: 480px;
			min-height: 480px;
			max-height: 480px;
		}

		.review-actions {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.page-shell {
			padding: 1.35rem 0.7rem 1.8rem;
		}

		.review-layout,
		.review-panels-container {
			gap: 0.7rem;
		}

		.review-sidebar {
			gap: 0.3rem;
		}

		.tracker-title,
		.tracker-count {
			font-size: 0.65rem;
		}

		.review-grid {
			gap: 0.3rem;
		}

		.grid-tile {
			height: 1.65rem;
		}

		.tile-number {
			font-size: 0.65rem;
		}

		.tile-icon {
			font-size: 0.42rem;
			margin-top: 0.08rem;
		}

		.review-main-card {
			height: 325px;
			min-height: 325px;
			max-height: 325px;
			padding: 0.8rem;
		}

		.inspection-header {
			padding-bottom: 0.4rem;
		}

		.q-index-tag,
		.ans-value {
			font-size: 0.82rem;
		}

		.format-label,
		.inspection-status,
		.ans-heading,
		.explanation-heading,
		.inspect-nav-btn,
		.inspect-counter {
			font-size: 0.62rem;
		}

		.inspection-scroll-area {
			gap: 0.6rem;
			padding: 0.5rem 0.2rem 0.5rem 0;
		}

		.japanese-prompt {
			font-size: 1rem;
			line-height: 1.35;
		}

		.english-subprompt,
		.explanation-body {
			font-size: 0.7rem;
			line-height: 1.45;
		}

		.answers-content {
			gap: 0.65rem;
		}

		.inspect-nav-btn {
			gap: 0.25rem;
			padding: 0.35rem 0.55rem;
		}
	}
</style>
