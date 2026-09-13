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

	// Side-panel Question Review State
	type FilterType = 'all' | 'wrong' | 'correct';
	let activeFilter = $state<FilterType>('all');
	let selectedIndex = $state(0);

	const wrongCount = $derived(questionResults.filter((q) => !q.isCorrect).length);
	const correctCount = $derived(questionResults.filter((q) => q.isCorrect).length);

	const filteredQuestions = $derived.by(() => {
		if (activeFilter === 'wrong') {
			return questionResults
				.map((q, idx) => ({ ...q, originalIndex: idx }))
				.filter((q) => !q.isCorrect);
		}
		if (activeFilter === 'correct') {
			return questionResults
				.map((q, idx) => ({ ...q, originalIndex: idx }))
				.filter((q) => q.isCorrect);
		}
		return questionResults.map((q, idx) => ({ ...q, originalIndex: idx }));
	});

	const activeQuestion = $derived(questionResults[selectedIndex] ?? questionResults[0] ?? null);

	function selectQuestionByIndex(idx: number) {
		if (idx >= 0 && idx < questionResults.length) {
			selectedIndex = idx;
		}
	}

	function setFilter(filter: FilterType) {
		activeFilter = filter;
		const matching = questionResults
			.map((q, idx) => ({ ...q, originalIndex: idx }))
			.filter((q) => {
				if (filter === 'wrong') return !q.isCorrect;
				if (filter === 'correct') return q.isCorrect;
				return true;
			});
		if (matching.length > 0) {
			const isCurrentMatching = matching.some((m) => m.originalIndex === selectedIndex);
			if (!isCurrentMatching) {
				selectedIndex = matching[0].originalIndex;
			}
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

	// Dynamic sarcastic commentary based on accuracy
	const sarcasticRemark = $derived.by(() => {
		if (accuracy === 100)
			return "「満点！？本当にカンニングしてない？」 (Perfect! Are you sure you didn't cheat?)";
		if (accuracy >= 80)
			return '「まあまあだな。次は全問正解を目指せ！」 (Not bad. Next time go for perfection!)';
		if (accuracy >= 50)
			return '「惜しい！もっと日本語を勉強しよう！」 (Halfway there! Keep grinding your Japanese!)';
		return "「えっ…本気で解いた？もう一回やってみようか！」 (Wait, were you serious? Let's try again!)";
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
			<p class="sarcastic-tag font-japanese">{sarcasticRemark}</p>
		</header>

		<!-- Main Score Dashboard -->
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

		<!-- Question Review Two-Column Section -->
		{#if questionResults.length > 0}
			<section class="review-section">
				<div class="review-header">
					<h2 class="review-title">
						<i class="fa-solid fa-list-check"></i>
						<span>Question Review · 解答確認</span>
					</h2>

					<!-- Filter Tabs -->
					<div class="filter-tabs" role="tablist">
						<button
							type="button"
							class="filter-tab font-mono {activeFilter === 'all' ? 'active' : ''}"
							onclick={() => setFilter('all')}
						>
							All ({totalQuestions})
						</button>
						<button
							type="button"
							class="filter-tab wrong-tab font-mono {activeFilter === 'wrong' ? 'active' : ''}"
							onclick={() => setFilter('wrong')}
						>
							<i class="fa-solid fa-xmark"></i> Wrong ({wrongCount})
						</button>
						<button
							type="button"
							class="filter-tab correct-tab font-mono {activeFilter === 'correct' ? 'active' : ''}"
							onclick={() => setFilter('correct')}
						>
							<i class="fa-solid fa-check"></i> Correct ({correctCount})
						</button>
					</div>
				</div>

				<div class="review-panels-container">
					<!-- Left Sidebar: Question List -->
					<aside class="review-sidebar">
						<div class="questions-nav-list">
							{#each filteredQuestions as q (q.questionId)}
								{@const isSelected = selectedIndex === q.originalIndex}
								<button
									type="button"
									class="q-nav-item {isSelected ? 'active' : ''} {q.isCorrect
										? 'is-correct'
										: 'is-wrong'}"
									onclick={() => selectQuestionByIndex(q.originalIndex)}
								>
									<div class="q-nav-badge font-mono">
										Q{q.originalIndex + 1}
									</div>

									<div class="q-nav-details">
										<span class="q-nav-prompt font-japanese">
											{q.promptJa ?? q.prompt}
										</span>
									</div>

									<div class="q-nav-status">
										{#if q.isCorrect}
											<i class="fa-solid fa-check correct-icon"></i>
										{:else}
											<i class="fa-solid fa-xmark wrong-icon"></i>
										{/if}
									</div>
								</button>
							{/each}

							{#if filteredQuestions.length === 0}
								<div class="no-filtered-msg">
									{#if activeFilter === 'wrong'}
										<i class="fa-solid fa-circle-check text-green"></i>
										<span>No wrong answers! Perfect run.</span>
									{:else}
										<span>No questions in this filter.</span>
									{/if}
								</div>
							{/if}
						</div>
					</aside>

					<!-- Right Main Inspection Card -->
					{#if activeQuestion}
						<main class="review-main-card">
							<!-- Card Header -->
							<div class="inspection-header">
								<div class="inspection-tags">
									<span class="q-index-tag font-mono">Q{selectedIndex + 1}</span>
									<span class="format-tag font-mono">
										{#if activeQuestion.format === 'multiple_choice'}
											<i class="fa-solid fa-list-check"></i> MULTIPLE CHOICE
										{:else if activeQuestion.format === 'gap_fill'}
											<i class="fa-solid fa-pen-to-square"></i> GAP FILL
										{:else if activeQuestion.format === 'word_ordering'}
											<i class="fa-solid fa-arrow-down-a-z"></i> WORD ORDERING
										{:else if activeQuestion.format === 'typing'}
											<i class="fa-solid fa-keyboard"></i> TYPING
										{/if}
									</span>
								</div>

								<div class="inspection-status {activeQuestion.isCorrect ? 'correct' : 'wrong'}">
									{#if activeQuestion.isCorrect}
										<i class="fa-solid fa-circle-check"></i>
										<span>CORRECT</span>
									{:else}
										<i class="fa-solid fa-circle-xmark"></i>
										<span>INCORRECT</span>
									{/if}
								</div>
							</div>

							<!-- Japanese Prompt Display -->
							<div class="inspection-prompt">
								<h3 class="japanese-prompt font-japanese">
									{activeQuestion.promptJa ?? activeQuestion.prompt}
								</h3>
								{#if activeQuestion.promptJa && activeQuestion.prompt && activeQuestion.prompt !== activeQuestion.promptJa}
									<p class="english-subprompt">{activeQuestion.prompt}</p>
								{/if}
							</div>

							<!-- Answer Comparison Cards -->
							<div class="answers-comparison">
								<!-- Player's Answer -->
								<div
									class="answer-card user-ans-card {activeQuestion.isCorrect
										? 'card-correct'
										: 'card-wrong'}"
								>
									<div class="card-label">
										<i class="fa-solid {activeQuestion.isCorrect ? 'fa-check' : 'fa-xmark'}"></i>
										<span>Your Answer</span>
									</div>
									<div class="card-content font-japanese">
										{activeQuestion.answer || '(No answer provided)'}
									</div>
								</div>

								<!-- Correct Answer (Always visible for clarity) -->
								{#if !activeQuestion.isCorrect || activeQuestion.correctAnswers.length > 0}
									<div class="answer-card correct-ans-card">
										<div class="card-label">
											<i class="fa-solid fa-check-double"></i>
											<span>Correct Answer</span>
										</div>
										<div class="card-content font-japanese">
											{activeQuestion.correctAnswers.join(' / ') || 'N/A'}
										</div>
									</div>
								{/if}
							</div>

							<!-- Educational Explanation Card -->
							{#if activeQuestion.explanation}
								<div class="explanation-box">
									<div class="explanation-title font-japanese">
										<i class="fa-solid fa-lightbulb"></i>
										<span>解説 (Explanation)</span>
									</div>
									<p class="explanation-text font-japanese">
										{activeQuestion.explanation}
									</p>
								</div>
							{/if}

							<!-- Card Navigation Footer -->
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
				</div>
			</section>
		{/if}

		<!-- Bottom CTA Actions -->
		<div class="results-actions">
			<Button href={resolve('/')} variant="primary" size="lg" fullWidth>
				<span>Play Again · もう一度プレイ</span>
			</Button>

			<Button href={resolve('/leaderboard')} variant="gold" size="md" fullWidth>
				<span>View Leaderboard · ランキング</span>
			</Button>
		</div>
	</div>
</div>

<style>
	.page-shell {
		min-height: 100vh;
		padding: 2rem 1rem 4rem;
		display: flex;
		justify-content: center;
	}

	.results-layout {
		width: min(100%, 960px);
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
		width: 140px;
		height: 140px;
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
		max-width: 600px;
		line-height: 1.4;
	}

	/* Score Showcase */
	.score-showcase {
		padding: 1.75rem 2rem;
		display: grid;
		gap: 1.5rem;
		text-align: center;
		border-radius: var(--radius-lg, 1rem);
		background: rgba(0, 15, 45, 0.65);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
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
		font-size: 4.2rem;
		font-weight: 900;
		line-height: 1;
		filter: drop-shadow(0 2px 12px rgba(255, 188, 13, 0.4));
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
		padding-top: 1rem;
		border-top: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
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

	/* Two-Column Review Layout */
	.review-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.review-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.review-title {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 800;
		color: var(--theme-text-main, #ffffff);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.review-title i {
		color: var(--theme-gold, #ffbc0d);
	}

	.filter-tabs {
		display: flex;
		gap: 0.35rem;
		background: rgba(0, 15, 45, 0.4);
		padding: 0.25rem;
		border-radius: var(--radius-md, 0.5rem);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
	}

	.filter-tab {
		background: transparent;
		border: none;
		padding: 0.4rem 0.75rem;
		border-radius: var(--radius-sm, 0.35rem);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--theme-text-muted, #94a3b8);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.filter-tab:hover {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.05);
	}

	.filter-tab.active {
		background: var(--theme-surface, #1e3a8a);
		color: #ffffff;
	}

	.filter-tab.wrong-tab.active {
		background: rgba(239, 68, 68, 0.25);
		color: #fca5a5;
		border: 1px solid rgba(239, 68, 68, 0.5);
	}

	.filter-tab.correct-tab.active {
		background: rgba(34, 197, 94, 0.25);
		color: #86efac;
		border: 1px solid rgba(34, 197, 94, 0.5);
	}

	.review-panels-container {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 1.25rem;
		min-height: 480px;
	}

	/* Left Sidebar */
	.review-sidebar {
		background: rgba(0, 15, 45, 0.55);
		backdrop-filter: blur(10px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-lg, 0.75rem);
		padding: 0.75rem;
		max-height: 580px;
		overflow-y: auto;
	}

	.questions-nav-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.q-nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0.85rem;
		border-radius: var(--radius-md, 0.5rem);
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid transparent;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
		width: 100%;
	}

	.q-nav-item:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.q-nav-item.active {
		background: rgba(255, 188, 13, 0.15);
		border-color: var(--theme-gold, #ffbc0d);
		box-shadow: 0 0 12px rgba(255, 188, 13, 0.2);
	}

	.q-nav-badge {
		font-size: 0.85rem;
		font-weight: 800;
		color: var(--theme-text-muted, #94a3b8);
		flex-shrink: 0;
		width: 2.2rem;
	}

	.q-nav-item.active .q-nav-badge {
		color: var(--theme-gold, #ffbc0d);
	}

	.q-nav-details {
		flex: 1;
		min-width: 0;
	}

	.q-nav-prompt {
		display: block;
		font-size: 0.88rem;
		color: var(--theme-text-main, #ffffff);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.q-nav-status {
		flex-shrink: 0;
		font-size: 0.95rem;
	}

	.correct-icon {
		color: #22c55e;
	}

	.wrong-icon {
		color: #ef4444;
	}

	.no-filtered-msg {
		padding: 2rem 1rem;
		text-align: center;
		color: var(--theme-text-muted, #94a3b8);
		font-size: 0.9rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.text-green {
		color: #22c55e;
		font-size: 1.5rem;
	}

	/* Right Main Inspection Card */
	.review-main-card {
		background: rgba(0, 15, 45, 0.7);
		backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.12));
		border-radius: var(--radius-lg, 0.75rem);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.inspection-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.inspection-tags {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.q-index-tag {
		font-size: 1.1rem;
		font-weight: 900;
		color: var(--theme-gold, #ffbc0d);
	}

	.format-tag {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm, 0.3rem);
		background: rgba(255, 255, 255, 0.08);
		color: var(--theme-text-muted, #cbd5e1);
	}

	.inspection-status {
		font-size: 0.85rem;
		font-weight: 800;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.75rem;
		border-radius: 9999px;
	}

	.inspection-status.correct {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
		border: 1px solid rgba(34, 197, 94, 0.4);
	}

	.inspection-status.wrong {
		background: rgba(239, 68, 68, 0.15);
		color: #f87171;
		border: 1px solid rgba(239, 68, 68, 0.4);
	}

	.inspection-prompt {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.japanese-prompt {
		margin: 0;
		font-size: clamp(1.3rem, 2.5vw, 1.6rem);
		font-weight: 700;
		line-height: 1.5;
		color: var(--theme-text-main, #ffffff);
	}

	.english-subprompt {
		margin: 0;
		font-size: 0.92rem;
		color: var(--theme-text-muted, #94a3b8);
	}

	/* Answers Comparison */
	.answers-comparison {
		display: grid;
		gap: 0.75rem;
	}

	.answer-card {
		padding: 1rem 1.2rem;
		border-radius: var(--radius-md, 0.5rem);
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.card-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.card-content {
		font-size: 1.15rem;
		font-weight: 700;
	}

	.user-ans-card.card-wrong {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.4);
		color: #fca5a5;
	}

	.user-ans-card.card-correct {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.4);
		color: #86efac;
	}

	.correct-ans-card {
		background: rgba(16, 185, 129, 0.15);
		border: 1px solid rgba(16, 185, 129, 0.5);
		color: #6ee7b7;
	}

	.correct-ans-card .card-label {
		color: #34d399;
	}

	/* Educational Explanation Box */
	.explanation-box {
		padding: 1.1rem 1.25rem;
		border-radius: var(--radius-md, 0.5rem);
		background: rgba(255, 188, 13, 0.06);
		border-left: 3px solid var(--theme-gold, #ffbc0d);
		border-top: 1px solid rgba(255, 188, 13, 0.15);
		border-right: 1px solid rgba(255, 188, 13, 0.15);
		border-bottom: 1px solid rgba(255, 188, 13, 0.15);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.explanation-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--theme-gold, #ffbc0d);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.explanation-text {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--theme-text-main, #f1f5f9);
	}

	/* Card Footer Navigation */
	.inspection-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.75rem;
		margin-top: auto;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.inspect-nav-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: var(--radius-sm, 0.35rem);
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: var(--theme-text-main, #ffffff);
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.inspect-nav-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.12);
		border-color: var(--theme-gold, #ffbc0d);
	}

	.inspect-nav-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.inspect-counter {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--theme-text-muted, #94a3b8);
	}

	/* Results Action Buttons */
	.results-actions {
		display: grid;
		gap: 0.85rem;
		margin-top: 0.5rem;
	}

	@media (max-width: 768px) {
		.review-panels-container {
			grid-template-columns: 1fr;
		}

		.review-sidebar {
			max-height: 240px;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
