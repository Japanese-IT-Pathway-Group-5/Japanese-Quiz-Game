<div class="quiz-skeleton-wrap" aria-hidden="true" role="status" aria-label="Loading question...">
	<div class="skeleton-content">
		<!-- Minimal Header -->
		<div class="skeleton-header">
			<div class="skeleton-header-left">
				<div class="skeleton" style="width: 75px; height: 1rem; border-radius: 4px;"></div>
				<div class="skeleton" style="width: 60px; height: 1rem; border-radius: 4px;"></div>
			</div>
			<div class="skeleton" style="width: 48px; height: 1.2rem; border-radius: 4px;"></div>
		</div>

		<!-- Question Body -->
		<div class="skeleton-body">
			<div class="skeleton-prompt-group">
				<div class="skeleton" style="width: 130px; height: 0.9rem; border-radius: 4px;"></div>
				<div class="skeleton" style="width: 90%; height: 2.2rem; border-radius: 6px;"></div>
				<div class="skeleton" style="width: 60%; height: 2.2rem; border-radius: 6px;"></div>
			</div>

			<!-- Choices Skeleton -->
			<div class="skeleton-choices-list">
				{#each [0, 1, 2, 3] as i (i)}
					<div class="skeleton-choice-card">
						<div
							class="skeleton"
							style="width: 1.75rem; height: 1.75rem; border-radius: 0.375rem; flex-shrink: 0;"
						></div>
						<div
							class="skeleton"
							style="width: {50 + (i % 3) * 15}%; height: 1.2rem; border-radius: 4px;"
						></div>
					</div>
				{/each}
			</div>

			<!-- Bottom Actions -->
			<div class="skeleton-bottom-actions">
				<div class="skeleton-nav-left">
					<div class="skeleton" style="width: 80px; height: 2.5rem; border-radius: 0.75rem;"></div>
					<div class="skeleton" style="width: 90px; height: 2.5rem; border-radius: 0.75rem;"></div>
				</div>
				<div class="skeleton" style="width: 80px; height: 2.5rem; border-radius: 0.75rem;"></div>
			</div>
		</div>
	</div>

	<!-- Sidebar Question Tracker Skeleton -->
	<aside class="skeleton-sidebar">
		<div class="skeleton-tracker-top">
			<div class="skeleton" style="width: 75px; height: 0.85rem; border-radius: 4px;"></div>
			<div class="skeleton" style="width: 35px; height: 0.85rem; border-radius: 4px;"></div>
		</div>

		<div class="skeleton-dots-grid">
			{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as i (i)}
				<div class="skeleton" style="height: 2.25rem; border-radius: 0.375rem;"></div>
			{/each}
		</div>

		<div
			class="skeleton"
			style="width: 100%; height: 2.75rem; border-radius: 0.75rem; margin-top: 0.5rem;"
		></div>
	</aside>
</div>

<style>
	.quiz-skeleton-wrap {
		width: min(100%, 920px);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 200px;
		gap: 2.5rem;
		align-items: start;
	}

	.skeleton-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
	}

	.skeleton-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.25rem;
	}

	.skeleton-header-left {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	.skeleton-body {
		display: grid;
		gap: 1.75rem;
	}

	.skeleton-prompt-group {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		width: 100%;
	}

	.skeleton-choices-list {
		display: grid;
		gap: 0.65rem;
	}

	.skeleton-choice-card {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.95rem 1.15rem;
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-md);
		background: var(--theme-paper);
		min-height: 3.6rem;
	}

	.skeleton-bottom-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.5rem;
	}

	.skeleton-nav-left {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.skeleton-sidebar {
		width: 180px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.skeleton-tracker-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.skeleton-dots-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	@media (max-width: 820px) {
		.quiz-skeleton-wrap {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.skeleton-sidebar {
			width: 100%;
		}
	}
</style>
