<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { QuestionSkeleton } from '$lib/components/ui';
	import Timer from '$lib/components/Timer.svelte';
	import SarcasticStickman from '$lib/components/SarcasticStickman.svelte';

	let { data }: { data: PageData } = $props();

	const allQuestions = $derived(data.allQuestions ?? (data.question ? [data.question] : []));
	const attempt = $derived(data.attempt);
	const totalQuestions = $derived(allQuestions.length || (attempt.chosenQuestions ?? []).length);

	// Active question navigation index
	let activeIndex = $state(0);
	const activeQuestion = $derived(allQuestions[activeIndex] ?? allQuestions[0]);

	// User answers state
	let userAnswers = $state<Record<string, string>>({});
	let userWordOrders = $state<Record<string, string[]>>({});
	let isSubmitting = $state(false);
	let showExitModal = $state(false);
	let showQuestionSelector = $state(false);

	// Drag & drop state for word ordering
	let draggedItem = $state<{ type: 'bank' | 'sentence'; word: string; index?: number } | null>(
		null
	);
	let dragOverIndex = $state<number | null>(null);
	let isDragOverBank = $state(false);

	// Load previously saved answers once on initialization
	let hasInitialized = false;
	$effect(() => {
		if (!hasInitialized && data.answeredMap && allQuestions.length > 0) {
			hasInitialized = true;
			for (const [qId, ans] of Object.entries(data.answeredMap)) {
				userAnswers[qId] = ans;
				const q = allQuestions.find((item) => item.id === qId);
				if (q && q.format === 'word_ordering') {
					try {
						const parsed = JSON.parse(ans);
						if (Array.isArray(parsed)) {
							userWordOrders[qId] = parsed;
						}
					} catch {
						// string answer
					}
				}
			}

			// Jump to first unanswered question on initial load only
			const firstUnanswered = allQuestions.findIndex((q) => !data.answeredMap?.[q.id]);
			if (firstUnanswered > 0) {
				activeIndex = firstUnanswered;
			}
		}
	});

	function selectChoice(choiceId: string) {
		if (!activeQuestion) return;
		userAnswers[activeQuestion.id] = choiceId;
	}

	function handleTypeInput(e: Event) {
		if (!activeQuestion) return;
		const target = e.target as HTMLInputElement;
		userAnswers[activeQuestion.id] = target.value;
	}

	function getSlots(qId: string, maxSlots: number): string[] {
		const existing = userWordOrders[qId] ?? [];
		const slots: string[] = new Array(maxSlots).fill('');
		for (let i = 0; i < maxSlots; i++) {
			if (existing[i]) {
				slots[i] = existing[i];
			}
		}
		return slots;
	}

	function addWordToSentence(word: string) {
		if (!activeQuestion) return;
		const maxSlots = (activeQuestion.choices ?? []).length;
		const slots = getSlots(activeQuestion.id, maxSlots);
		const firstEmpty = slots.findIndex((s) => !s);
		if (firstEmpty !== -1) {
			slots[firstEmpty] = word;
			userWordOrders[activeQuestion.id] = slots;
			userAnswers[activeQuestion.id] = slots.some(Boolean) ? JSON.stringify(slots) : '';
		}
	}

	function removeWordFromSentence(slotIdx: number) {
		if (!activeQuestion) return;
		const maxSlots = (activeQuestion.choices ?? []).length;
		const slots = getSlots(activeQuestion.id, maxSlots);
		if (slotIdx >= 0 && slotIdx < maxSlots) {
			slots[slotIdx] = '';
			userWordOrders[activeQuestion.id] = slots;
			userAnswers[activeQuestion.id] = slots.some(Boolean) ? JSON.stringify(slots) : '';
		}
	}

	function resetSentence() {
		if (!activeQuestion) return;
		userWordOrders[activeQuestion.id] = [];
		userAnswers[activeQuestion.id] = '';
	}

	function handleDragStartBank(e: DragEvent, word: string) {
		draggedItem = { type: 'bank', word };
		if (e.dataTransfer) {
			e.dataTransfer.setData('text/plain', word);
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragStartSentence(e: DragEvent, word: string, index: number) {
		draggedItem = { type: 'sentence', word, index };
		if (e.dataTransfer) {
			e.dataTransfer.setData('text/plain', word);
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOverSlot(e: DragEvent, slotIdx: number) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		dragOverIndex = slotIdx;
	}

	function handleDragLeaveSlot(slotIdx: number) {
		if (dragOverIndex === slotIdx) {
			dragOverIndex = null;
		}
	}

	function handleDropOnSlot(e: DragEvent, targetIdx: number) {
		e.preventDefault();
		dragOverIndex = null;
		if (!activeQuestion || !draggedItem) return;

		const maxSlots = (activeQuestion.choices ?? []).length;
		if (targetIdx < 0 || targetIdx >= maxSlots) {
			draggedItem = null;
			return;
		}

		const slots = getSlots(activeQuestion.id, maxSlots);

		if (draggedItem.type === 'bank') {
			slots[targetIdx] = draggedItem.word;
		} else if (draggedItem.type === 'sentence' && draggedItem.index !== undefined) {
			const fromIdx = draggedItem.index;
			if (fromIdx !== targetIdx && fromIdx >= 0 && fromIdx < maxSlots) {
				const temp = slots[targetIdx];
				slots[targetIdx] = slots[fromIdx];
				slots[fromIdx] = temp;
			}
		}

		userWordOrders[activeQuestion.id] = slots;
		userAnswers[activeQuestion.id] = slots.some(Boolean) ? JSON.stringify(slots) : '';
		draggedItem = null;
	}

	function handleDragOverBank(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		isDragOverBank = true;
	}

	function handleDragLeaveBank() {
		isDragOverBank = false;
	}

	function handleDropOnBank(e: DragEvent) {
		e.preventDefault();
		isDragOverBank = false;
		if (!activeQuestion || !draggedItem) return;

		if (draggedItem.type === 'sentence' && draggedItem.index !== undefined) {
			removeWordFromSentence(draggedItem.index);
		}
		draggedItem = null;
	}

	function handleDragEnd() {
		draggedItem = null;
		dragOverIndex = null;
		isDragOverBank = false;
	}

	function getAvailableWords(question: typeof activeQuestion) {
		if (!question || !question.choices) return [];
		const allChoices = question.choices.map((c) => c.text);
		const placed = (userWordOrders[question.id] ?? []).filter((w): w is string =>
			Boolean(w && w.trim())
		);
		const counts: Record<string, number> = {};
		for (const w of placed) {
			counts[w] = (counts[w] || 0) + 1;
		}
		const available: string[] = [];
		for (const c of allChoices) {
			if (counts[c] && counts[c] > 0) {
				counts[c]--;
			} else {
				available.push(c);
			}
		}
		return available;
	}

	function renderGapFillSentence(text: string) {
		const gapRegex = /(_{3,5}|（\s*）|\(\s*\)|\[\s*\])/g;
		if (!gapRegex.test(text)) {
			return [{ type: 'text', value: text }];
		}
		const segments = text.split(gapRegex);
		return segments.map((segment) => {
			if (/^(_{3,5}|（\s*）|\(\s*\)|\[\s*\])$/.test(segment)) {
				return { type: 'blank', value: '' };
			}
			return { type: 'text', value: segment };
		});
	}

	function renderWordOrderingSentence(promptText: string, totalSlots: number) {
		const slotRegex = /(\[\s*\d*\s*\])/g;
		const hasSlots = slotRegex.test(promptText);

		if (!hasSlots) {
			return {
				hasEmbeddedSlots: false,
				segments: [{ type: 'text' as const, value: promptText }]
			};
		}

		const parts = promptText.split(slotRegex);
		let slotCounter = 0;

		const segments = parts.map((part) => {
			if (slotRegex.test(part) || /^\[\s*\d*\s*\]$/.test(part)) {
				const currentSlotIdx = slotCounter;
				slotCounter++;
				return {
					type: 'slot' as const,
					value: part,
					slotIndex: currentSlotIdx
				};
			}
			return {
				type: 'text' as const,
				value: part
			};
		});

		while (slotCounter < totalSlots) {
			segments.push({
				type: 'slot' as const,
				value: `[${slotCounter + 1}]`,
				slotIndex: slotCounter
			});
			slotCounter++;
		}

		return {
			hasEmbeddedSlots: true,
			segments
		};
	}

	function goToQuestion(idx: number) {
		if (idx >= 0 && idx < totalQuestions) {
			activeIndex = idx;
		}
	}

	function goPrevious() {
		if (activeIndex > 0) {
			activeIndex--;
		}
	}

	function goNext() {
		if (activeIndex < totalQuestions - 1) {
			activeIndex++;
		}
	}

	function isQuestionAnswered(qId: string): boolean {
		const q = allQuestions.find((item) => item.id === qId);
		if (!q) return false;
		const ans = userAnswers[qId];
		if (!ans || !ans.trim()) return false;

		if (q.format === 'word_ordering') {
			const totalChoices = (q.choices ?? []).length;
			const placed = (userWordOrders[qId] ?? []).filter((w) => Boolean(w && w.trim()));
			return totalChoices > 0 && placed.length === totalChoices;
		}

		if (q.format === 'multiple_choice' || q.format === 'gap_fill') {
			return Boolean(ans.trim());
		}

		if (q.format === 'typing') {
			return ans.trim().length > 0;
		}

		return ans.trim().length > 0;
	}

	const isCurrentQuestionDone = $derived(
		activeQuestion ? isQuestionAnswered(activeQuestion.id) : false
	);
	const answeredCount = $derived(allQuestions.filter((q) => isQuestionAnswered(q.id)).length);
</script>

<svelte:head>
	<title>Quiz · 問題 · Japanese Quiz Game</title>
</svelte:head>

<div class="page-shell quiz-page-shell">
	{#if !activeQuestion || totalQuestions === 0}
		<QuestionSkeleton />
	{:else}
		<div class="quiz-container">
			<!-- Main Question Form Card -->
			<div class="quiz-content">
				<!-- Clean Minimal Header -->
				<div class="quiz-header">
					<button
						type="button"
						class="header-exit-btn font-mono"
						onclick={() => (showExitModal = true)}
						title="Exit quiz"
						aria-label="Exit quiz"
					>
						<i class="fa-solid fa-right-from-bracket"></i>
						<span class="exit-btn-label">Exit</span>
					</button>

					<div class="header-center font-mono">
						<span class="level-indicator">LEVEL {attempt.level}</span>
						<span class="header-dot" aria-hidden="true">•</span>
						<Timer startedAt={new Date(attempt.startedAt)} />
					</div>

					<div class="header-right-spacer" aria-hidden="true"></div>
				</div>

				<!-- Slim Progress Line -->
				<div
					class="quiz-progress-line"
					role="progressbar"
					aria-valuenow={answeredCount}
					aria-valuemin={0}
					aria-valuemax={totalQuestions}
					aria-label="Quiz completion progress"
				>
					<div
						class="quiz-progress-fill"
						style="width: {(answeredCount / totalQuestions) * 100}%"
					></div>
				</div>

				{#if activeQuestion}
					<form
						method="POST"
						class="question-body"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								await update();
								isSubmitting = false;
							};
						}}
					>
						<input type="hidden" name="questionId" value={activeQuestion.id} />

						<!-- Upper Zone: Format Tag & Prompt -->
						<div class="prompt-zone">
							<span class="format-text font-mono">
								{#if activeQuestion.format === 'multiple_choice'}
									<i class="fa-solid fa-list-check"></i>
									<span>MULTIPLE CHOICE</span>
								{:else if activeQuestion.format === 'gap_fill'}
									<i class="fa-solid fa-pen-to-square"></i>
									<span>GAP FILL</span>
								{:else if activeQuestion.format === 'typing'}
									<i class="fa-solid fa-keyboard"></i>
									<span>TYPING</span>
								{:else if activeQuestion.format === 'word_ordering'}
									<i class="fa-solid fa-arrow-down-a-z"></i>
									<span>WORD ORDERING</span>
								{/if}
							</span>

							{#if activeQuestion.format === 'word_ordering'}
								{@const totalSlots = (activeQuestion.choices ?? []).length}
								{@const placedWords = getSlots(activeQuestion.id, totalSlots)}
								{@const parsedSentence = renderWordOrderingSentence(
									activeQuestion.promptJa ?? activeQuestion.prompt,
									totalSlots
								)}

								{#if parsedSentence.hasEmbeddedSlots}
									<h2 class="prompt-japanese prompt-inline-sentence font-japanese">
										{#each parsedSentence.segments as part, index (index)}
											{#if part.type === 'slot'}
												{@const placedWord = placedWords[part.slotIndex]}
												<span
													class="inline-slot {placedWord ? 'filled' : 'empty'} {dragOverIndex ===
													part.slotIndex
														? 'slot-hover'
														: ''}"
													ondragover={(e) => handleDragOverSlot(e, part.slotIndex)}
													ondragleave={() => handleDragLeaveSlot(part.slotIndex)}
													ondrop={(e) => handleDropOnSlot(e, part.slotIndex)}
													role="region"
													aria-label={`Slot ${part.slotIndex + 1}`}
												>
													{#if placedWord}
														<button
															type="button"
															class="inline-placed-chip font-japanese"
															draggable="true"
															ondragstart={(e) =>
																handleDragStartSentence(e, placedWord, part.slotIndex)}
															ondragend={handleDragEnd}
															onclick={() => removeWordFromSentence(part.slotIndex)}
															title="Click to remove or drag to swap"
														>
															<span>{placedWord}</span>
															<span class="remove-x" aria-hidden="true">&times;</span>
														</button>
													{:else}
														<span class="inline-placeholder font-mono">
															{part.value.replace(/\[|\]/g, '').trim() || part.slotIndex + 1}
														</span>
													{/if}
												</span>
											{:else}
												<span class="sentence-text">{part.value}</span>
											{/if}
										{/each}
									</h2>
								{:else}
									<h2 class="prompt-japanese font-japanese">
										{activeQuestion.promptJa ?? activeQuestion.prompt}
									</h2>
								{/if}
							{:else if activeQuestion.format === 'gap_fill'}
								{@const selectedChoice = activeQuestion.choices?.find(
									(c) => c.id === userAnswers[activeQuestion.id]
								)}
								<h2 class="prompt-japanese prompt-gap font-japanese">
									{#each renderGapFillSentence(activeQuestion.promptJa ?? activeQuestion.prompt) as part, index (part.type + '-' + index)}
										{#if part.type === 'blank'}
											<span class="gap-blank {selectedChoice ? 'filled font-japanese' : ''}">
												{selectedChoice ? selectedChoice.text : ''}
											</span>
										{:else}
											<span>{part.value}</span>
										{/if}
									{/each}
								</h2>
							{:else}
								<h2 class="prompt-japanese font-japanese">
									{activeQuestion.promptJa ?? activeQuestion.prompt}
								</h2>
							{/if}
						</div>

						<!-- Lower Zone: Interactive Answer Input -->
						<div class="answer-zone">
							{#if activeQuestion.format === 'multiple_choice' || activeQuestion.format === 'gap_fill'}
								<div class="choices-list" role="radiogroup" aria-label="Choices">
									{#each activeQuestion.choices ?? [] as choice, idx (choice.id)}
										{@const isSelected = userAnswers[activeQuestion.id] === choice.id}
										{@const letter = String.fromCharCode(65 + idx)}
										<label class="choice-item {isSelected ? 'selected' : ''}">
											<input
												type="radio"
												name="answer"
												value={choice.id}
												checked={isSelected}
												onchange={() => selectChoice(choice.id)}
											/>
											<span class="choice-letter font-mono">{letter}</span>
											<span class="choice-text font-japanese">{choice.text}</span>
										</label>
									{/each}
								</div>
							{/if}

							<!-- Typing Format -->
							{#if activeQuestion.format === 'typing'}
								<div class="typing-group">
									<label class="typing-label" for="typing-input">
										<span>Your Answer</span>
										<span class="typing-hint">Type in Japanese (Romaji / Hiragana / Kanji)</span>
									</label>
									<input
										id="typing-input"
										name="answer"
										type="text"
										class="input-text typing-input font-japanese"
										placeholder="答えを入力してください..."
										value={userAnswers[activeQuestion.id] ?? ''}
										oninput={handleTypeInput}
										autocomplete="off"
										autocapitalize="off"
										spellcheck="false"
									/>
								</div>
							{/if}

							<!-- Word Ordering (Bank & Builder) -->
							{#if activeQuestion.format === 'word_ordering'}
								{@const totalSlots = (activeQuestion.choices ?? []).length}
								{@const placedWords = getSlots(activeQuestion.id, totalSlots)}
								{@const availableWords = getAvailableWords(activeQuestion)}
								{@const parsedSentence = renderWordOrderingSentence(
									activeQuestion.promptJa ?? activeQuestion.prompt,
									totalSlots
								)}

								<div class="word-ordering-group">
									<!-- If prompt didn't have embedded bracket slots, render the sentence builder line here -->
									{#if !parsedSentence.hasEmbeddedSlots}
										<div class="standalone-sentence-line font-japanese">
											{#each Array.from({ length: totalSlots }, (_, i) => i) as slotIdx (slotIdx)}
												{@const placedWord = placedWords[slotIdx]}
												<span
													class="inline-slot {placedWord ? 'filled' : 'empty'} {dragOverIndex ===
													slotIdx
														? 'slot-hover'
														: ''}"
													ondragover={(e) => handleDragOverSlot(e, slotIdx)}
													ondragleave={() => handleDragLeaveSlot(slotIdx)}
													ondrop={(e) => handleDropOnSlot(e, slotIdx)}
													role="region"
													aria-label={`Slot ${slotIdx + 1}`}
												>
													{#if placedWord}
														<button
															type="button"
															class="inline-placed-chip font-japanese"
															draggable="true"
															ondragstart={(e) => handleDragStartSentence(e, placedWord, slotIdx)}
															ondragend={handleDragEnd}
															onclick={() => removeWordFromSentence(slotIdx)}
															title="Click to remove or drag to swap"
														>
															<span>{placedWord}</span>
															<span class="remove-x" aria-hidden="true">&times;</span>
														</button>
													{:else}
														<span class="inline-placeholder font-mono">{slotIdx + 1}</span>
													{/if}
												</span>
											{/each}
										</div>
									{/if}

									<div class="wo-header">
										<span class="typing-hint">Drag words into the sentence, or tap to place</span>
										{#if placedWords.some(Boolean)}
											<button
												type="button"
												class="reset-order-btn font-mono"
												onclick={resetSentence}
											>
												Reset
											</button>
										{/if}
									</div>

									<!-- Word Bank (Available words) -->
									<div
										class="word-bank-area {isDragOverBank ? 'bank-hover' : ''}"
										ondragover={handleDragOverBank}
										ondragleave={handleDragLeaveBank}
										ondrop={handleDropOnBank}
										role="region"
										aria-label="Available words bank"
									>
										{#if availableWords.length === 0}
											<span class="bank-empty-text">All words placed in sentence</span>
										{:else}
											<div class="bank-chips">
												{#each availableWords as word, idx (word + '-' + idx)}
													<button
														type="button"
														class="word-chip bank-chip font-japanese"
														draggable="true"
														ondragstart={(e) => handleDragStartBank(e, word)}
														ondragend={handleDragEnd}
														onclick={() => addWordToSentence(word)}
														title="Drag into sentence or tap to place"
													>
														<span class="chip-text">{word}</span>
													</button>
												{/each}
											</div>
										{/if}
									</div>

									<!-- Hidden inputs for submission -->
									<input
										type="hidden"
										name="answer"
										value={placedWords.some(Boolean) ? JSON.stringify(placedWords) : ''}
									/>
									{#each placedWords as w, i (i)}
										<input type="hidden" name={`answer-${i}`} value={w} />
									{/each}
								</div>
							{/if}
						</div>

						<!-- Bottom Navigation Actions -->
						<div class="bottom-actions">
							<button
								type="button"
								class="nav-btn prev-btn font-mono"
								disabled={activeIndex === 0}
								onclick={goPrevious}
							>
								<i class="fa-solid fa-arrow-left"></i>
								<span>Prev</span>
							</button>

							<button
								type="button"
								class="picker-trigger-btn font-mono"
								onclick={() => (showQuestionSelector = true)}
								title="Select question"
								aria-label={`Question ${activeIndex + 1} of ${totalQuestions}. Tap to jump to question.`}
							>
								<i class="fa-solid fa-list-ol picker-trigger-icon" aria-hidden="true"></i>
								<span class="picker-trigger-text">
									<strong class="q-current">{activeIndex + 1}</strong>
									<span class="q-slash">/</span>
									<span class="q-total">{totalQuestions}</span>
								</span>
								<i class="fa-solid fa-chevron-up q-caret" aria-hidden="true"></i>
							</button>

							{#if activeIndex === totalQuestions - 1}
								<button
									type="submit"
									class="nav-btn next-btn finish-btn font-mono"
									name="finish"
									value="true"
									disabled={isSubmitting || answeredCount < totalQuestions}
								>
									<span>Finish ({answeredCount}/{totalQuestions})</span>
									<i class="fa-solid fa-flag-checkered"></i>
								</button>
							{:else}
								<button
									type="button"
									class="nav-btn next-btn font-mono"
									disabled={!isCurrentQuestionDone}
									onclick={goNext}
								>
									<span>Next</span>
									<i class="fa-solid fa-arrow-right"></i>
								</button>
							{/if}
						</div>
					</form>
				{/if}
			</div>

			<!-- Right Side Question Dots Tracker -->
			<aside class="sidebar-tracker">
				<div class="tracker-top">
					<span class="tracker-title font-mono">QUESTIONS</span>
					<span class="tracker-count font-mono">{answeredCount}/{totalQuestions}</span>
				</div>

				<!-- Clean 5x2 Dot Grid -->
				<div class="dots-grid">
					{#each allQuestions as q, index (q.id)}
						{@const isCurrent = activeIndex === index}
						{@const isDone = isQuestionAnswered(q.id)}

						<button
							type="button"
							class="dot-btn font-mono {isCurrent ? 'current' : ''} {isDone ? 'done' : ''}"
							onclick={() => goToQuestion(index)}
							title={`Question ${index + 1}`}
						>
							{index + 1}
						</button>
					{/each}
				</div>
			</aside>
		</div>
	{/if}
</div>

<!-- Exit Confirmation Warning Modal -->
{#if showExitModal}
	<div
		class="modal-backdrop"
		onclick={() => (showExitModal = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') showExitModal = false;
		}}
		role="dialog"
		aria-modal="true"
		aria-labelledby="exit-modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="exit-modal" onclick={(e) => e.stopPropagation()} role="document">
			<SarcasticStickman class="modal-stickman" blinkImmediately={true} blinkIntervalMs={1500} />

			<h2 id="exit-modal-title" class="modal-title font-japanese">クイズを中断しますか？</h2>
			<p class="modal-desc">
				Are you sure you want to exit? Your progress in this quiz session will be lost.
			</p>

			<div class="modal-actions">
				<button
					type="button"
					class="modal-btn cancel-btn font-mono"
					onclick={() => (showExitModal = false)}
				>
					Cancel
				</button>

				<a href={resolve('/')} class="modal-btn confirm-btn font-mono">
					<i class="fa-solid fa-right-from-bracket"></i>
					<span>Exit Game</span>
				</a>
			</div>
		</div>
	</div>
{/if}

<!-- Full-screen / Modal Question Selector -->
{#if showQuestionSelector}
	<div
		class="selector-backdrop"
		onclick={() => (showQuestionSelector = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') showQuestionSelector = false;
		}}
		role="dialog"
		aria-modal="true"
		aria-labelledby="selector-modal-title"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div class="selector-modal" onclick={(e) => e.stopPropagation()} role="document">
			<div class="selector-header">
				<div class="selector-header-info">
					<h2 id="selector-modal-title" class="selector-title font-japanese">
						<span>問題一覧</span>
						<span class="selector-title-en font-mono">QUESTIONS</span>
					</h2>
					<span class="selector-count-badge font-mono">
						<i class="fa-solid fa-circle-check"></i>
						<span>{answeredCount} / {totalQuestions}</span>
					</span>
				</div>

				<button
					type="button"
					class="selector-close-btn"
					onclick={() => (showQuestionSelector = false)}
					aria-label="Close question list"
				>
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>

			<div class="picker-scroll-container">
				<div class="picker-rows-list">
					{#each allQuestions as q, idx (q.id)}
						{@const isCurrent = activeIndex === idx}
						{@const isDone = isQuestionAnswered(q.id)}
						<button
							type="button"
							class="picker-row {isCurrent ? 'is-current' : ''} {isDone ? 'is-done' : ''}"
							onclick={() => {
								goToQuestion(idx);
								showQuestionSelector = false;
							}}
							aria-current={isCurrent ? 'step' : undefined}
						>
							<span class="row-num font-mono">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>

							<div class="row-content">
								<span class="row-prompt font-japanese">
									{q.promptJa ?? q.prompt}
								</span>
								<span class="row-format-tag font-mono">
									{#if q.format === 'multiple_choice'}
										Multiple Choice
									{:else if q.format === 'gap_fill'}
										Gap Fill
									{:else if q.format === 'word_ordering'}
										Word Order
									{:else if q.format === 'typing'}
										Typing
									{/if}
								</span>
							</div>

							<div class="row-status">
								{#if isCurrent}
									{#if isDone}
										<span class="done-badge font-mono" title="Answered">
											<i class="fa-solid fa-check done-check-icon" aria-hidden="true"></i>
										</span>
									{/if}
									<span class="current-badge font-mono">NOW</span>
								{:else if isDone}
									<span class="done-badge font-mono" title="Answered">
										<i class="fa-solid fa-check done-check-icon" aria-hidden="true"></i>
									</span>
								{:else}
									<span class="pending-badge font-mono" title="Pending">
										<i class="fa-regular fa-circle"></i>
									</span>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Anchors top position with clean solid background */
	:global(.page-shell.quiz-page-shell) {
		align-items: flex-start !important;
		background: var(--theme-background) !important;
	}

	/* 2-Column Layout */
	.quiz-container {
		width: min(100%, 920px);
		margin: clamp(2.5rem, 6vh, 4rem) auto 3rem auto;
		display: grid;
		grid-template-columns: 1fr 200px;
		gap: 2.5rem;
		align-items: start;
	}

	.quiz-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-width: 0;
	}

	/* Clean Minimal Header (No Line) */
	.quiz-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.25rem;
	}

	.header-center {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.header-dot {
		color: var(--theme-border);
		font-size: 0.75rem;
		opacity: 0.6;
		user-select: none;
	}

	.header-right-spacer {
		width: 72px; /* balances the exit button */
	}

	.level-indicator {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: var(--theme-gold);
	}

	.header-exit-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		background: #dc2626;
		border: 1px solid #dc2626;
		color: #ffffff;
		padding: 0.4rem 0.85rem;
		border-radius: var(--radius-sm);
		font-size: 0.82rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 1px 4px rgba(220, 38, 38, 0.3);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		user-select: none;
	}

	.header-exit-btn:hover {
		background: #b91c1c;
		border-color: #b91c1c;
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
	}

	.header-exit-btn:active {
		transform: scale(0.97);
	}

	.quiz-progress-line {
		display: none;
	}

	/* Question Body - Stable Locked Height so Navigation Controls Remain Stationary */
	.question-body {
		display: flex;
		flex-direction: column;
		min-height: 520px;
		justify-content: space-between;
	}

	.prompt-zone {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		align-items: flex-start;
		width: 100%;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--theme-border);
		flex-shrink: 0;
	}

	.answer-zone {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		flex: 1;
		min-height: 280px;
		padding: 1.25rem 0;
	}

	.format-text {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		color: var(--theme-gold);
		text-transform: uppercase;
	}

	.format-text i {
		font-size: 0.78rem;
		opacity: 0.85;
	}

	.prompt-japanese {
		margin: 0;
		font-size: clamp(1.4rem, 3.2vw, 1.9rem);
		line-height: 1.5;
		font-weight: 700;
		color: var(--theme-text-main);
		word-break: break-word;
	}

	.prompt-gap {
		display: inline-block;
	}

	.gap-blank {
		display: inline-block;
		min-width: 4rem;
		padding: 0 0.35rem;
		border-bottom: 2.5px solid var(--theme-gold);
		text-align: center;
		font-weight: 900;
		color: var(--theme-gold);
	}

	/* Multiple Choice Options */
	.choices-list {
		display: grid;
		gap: 0.65rem;
	}

	.choice-item {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.95rem 1.15rem;
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-md);
		background: var(--theme-paper);
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		user-select: none;
		box-shadow: none;
	}

	.choice-item input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	/* Metallic shine sweep light effect matching N4/N3 segment */
	.choice-item::after {
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

	.choice-item:hover::after {
		left: 150%;
		transition: left 3.4s cubic-bezier(0.2, 0.8, 0.25, 1);
	}

	.choice-item:hover:not(.selected) {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		transform: translateY(-2px);
		box-shadow: none;
	}

	.choice-item:hover:not(.selected) .choice-text {
		color: #ffffff;
	}

	.choice-item.selected {
		background: var(--theme-gold-shimmer);
		border-color: var(--theme-gold);
		color: #022659;
		box-shadow: none;
		transform: translateY(-2px);
	}

	.choice-item.selected:hover {
		filter: brightness(1.05);
		box-shadow: none;
	}

	.choice-item:active {
		transform: translateY(1px) scale(0.98);
		filter: brightness(0.96);
	}

	.choice-letter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.08);
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--theme-text-muted);
		flex-shrink: 0;
		position: relative;
		z-index: 1;
	}

	.choice-item.selected .choice-letter {
		background: #022659;
		color: #ffffff;
	}

	.choice-text {
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--theme-text-main);
		position: relative;
		z-index: 1;
	}

	.choice-item.selected .choice-text {
		color: #022659;
		font-weight: 800;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	/* Typing */
	.typing-group {
		display: grid;
		gap: 0.5rem;
	}

	.typing-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--theme-text-main);
	}

	.typing-hint {
		font-size: 0.78rem;
		font-weight: normal;
		color: var(--theme-text-muted);
	}

	.typing-input {
		font-size: 1.15rem;
		box-shadow: none !important;
	}

	.typing-input:hover,
	.typing-input:focus,
	.typing-input:active {
		box-shadow: none !important;
	}

	/* Word Ordering Interactive Inline Builder */
	.prompt-inline-sentence {
		display: block;
		line-height: 2.3;
	}

	.sentence-text {
		display: inline;
	}

	.inline-slot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
		margin: 0 0.25rem;
		min-width: 4rem;
		min-height: 2.5rem;
		padding: 0 0.25rem;
		border-radius: var(--radius-sm);
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		position: relative;
	}

	.inline-slot.empty {
		border-bottom: 2px dashed rgba(255, 188, 13, 0.6);
		background: rgba(255, 188, 13, 0.05);
	}

	.inline-slot.filled {
		border-bottom: none;
		background: transparent;
		padding: 0;
	}

	.inline-slot.slot-hover {
		background: rgba(255, 188, 13, 0.25);
		border-bottom-color: #ffffff;
		transform: scale(1.05);
		box-shadow: none;
	}

	.inline-placeholder {
		width: 100%;
		text-align: center;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--theme-gold);
		opacity: 0.55;
		user-select: none;
		pointer-events: none;
	}

	.inline-placed-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0.8rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--theme-gold);
		background: var(--theme-paper);
		color: var(--theme-text-main);
		font-size: 1.05rem;
		font-weight: 700;
		cursor: grab;
		user-select: none;
		touch-action: manipulation;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: none;
	}

	.inline-placed-chip:active {
		cursor: grabbing;
		transform: scale(0.97);
	}

	.inline-placed-chip:hover {
		border-color: #ef4444;
		color: #ef4444;
		transform: translateY(-1px);
		box-shadow: none;
	}

	.remove-x {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.08);
		font-size: 0.85rem;
		line-height: 1;
		opacity: 0.7;
		transition: all 0.15s ease;
	}

	.inline-placed-chip:hover .remove-x {
		background: rgba(239, 68, 68, 0.25);
		color: #ef4444;
		opacity: 1;
	}

	.standalone-sentence-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		padding: 0.75rem 1rem;
		background: rgba(0, 20, 50, 0.25);
		border: 1px solid rgba(255, 188, 13, 0.15);
		border-radius: var(--radius-md);
		min-height: 3.6rem;
	}

	.word-ordering-group {
		display: grid;
		gap: 0.85rem;
		background: rgba(0, 20, 55, 0.2);
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-lg);
		padding: 1.15rem;
	}

	.wo-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.25rem;
	}

	.reset-order-btn {
		background: rgba(255, 188, 13, 0.08);
		border: 1px solid rgba(255, 188, 13, 0.25);
		color: var(--theme-gold);
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;
		padding: 0.25rem 0.65rem;
		border-radius: 999px;
		transition: all 0.2s ease;
	}

	.reset-order-btn:hover {
		background: rgba(255, 188, 13, 0.2);
		border-color: var(--theme-gold);
		color: #ffffff;
		transform: translateY(-1px);
	}

	.word-bank-area {
		margin-top: 0.15rem;
		padding: 0.25rem 0;
		background: transparent;
		border: none;
		display: flex;
		align-items: center;
		min-height: 3.2rem;
		transition: background 0.2s ease;
		border-radius: var(--radius-md);
	}

	.word-bank-area.bank-hover {
		background: rgba(255, 188, 13, 0.08);
		outline: 2px dashed var(--theme-gold);
	}

	.bank-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		width: 100%;
	}

	.word-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.15rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--theme-border);
		background: var(--theme-paper);
		color: var(--theme-text-main);
		font-size: 1.05rem;
		font-weight: 600;
		cursor: grab;
		user-select: none;
		touch-action: manipulation;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: none;
	}

	.word-chip:active {
		cursor: grabbing;
		transform: translateY(1px) scale(0.98);
		filter: brightness(0.96);
	}

	.bank-chip:hover {
		border-color: var(--theme-gold);
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		color: #ffffff;
		transform: translateY(-2px);
		box-shadow: none;
	}

	.bank-empty-text {
		width: 100%;
		text-align: center;
		font-size: 0.85rem;
		color: var(--theme-text-muted);
		opacity: 0.7;
	}

	/* Bottom Actions - Pinned Stationary at Bottom of Question Card */
	.bottom-actions {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
		padding-top: 1.25rem;
		margin-top: auto;
		flex-shrink: 0;
		border-top: 1px solid var(--theme-border);
		width: 100%;
	}

	.prev-btn {
		width: 100%;
		justify-content: center;
	}

	.next-btn {
		width: 100%;
		justify-content: center;
	}

	.picker-trigger-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		height: 42px;
		min-height: 42px;
		max-height: 42px;
		padding: 0 0.85rem;
		border-radius: var(--radius-sm);
		background: var(--theme-paper);
		border: 1px solid var(--theme-border);
		color: var(--theme-text-main);
		cursor: pointer;
		user-select: none;
		transition: all 0.2s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
		white-space: nowrap;
	}

	.picker-trigger-btn:hover {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		border-color: var(--theme-gold);
		color: #ffffff;
	}

	.picker-trigger-icon {
		font-size: 0.82rem;
		color: var(--theme-gold);
	}

	.picker-trigger-text {
		display: inline-flex;
		align-items: baseline;
		gap: 0.2rem;
	}

	.q-current {
		font-weight: 800;
		font-size: 0.95rem;
		color: #ffffff;
	}

	.q-slash {
		color: var(--theme-text-muted);
		font-size: 0.78rem;
		opacity: 0.65;
	}

	.q-total {
		color: var(--theme-gold);
		font-size: 0.88rem;
		font-weight: 700;
	}

	.q-caret {
		font-size: 0.65rem;
		color: var(--theme-gold);
		margin-left: 0.1rem;
		opacity: 0.85;
		transition: transform 0.2s ease;
	}

	.picker-trigger-btn:hover .q-caret {
		transform: translateY(-2px);
	}

	.nav-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		height: 42px;
		min-height: 42px;
		max-height: 42px;
		padding: 0 1rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--theme-border);
		background: var(--theme-paper);
		color: var(--theme-text-main);
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
		user-select: none;
		width: 100%;
		box-sizing: border-box;
	}

	/* Metallic shine sweep */
	.nav-btn::after {
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

	.nav-btn:hover:not(:disabled)::after {
		left: 150%;
		transition: left 3.4s cubic-bezier(0.2, 0.8, 0.25, 1);
	}

	.nav-btn:hover:not(:disabled) {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}

	.nav-btn:active:not(:disabled) {
		transform: translateY(1px) scale(0.98);
		filter: brightness(0.96);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
	}

	.nav-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
		transform: none !important;
		box-shadow: none !important;
	}

	.next-btn {
		background: var(--theme-gold-shimmer, #ffbc0d);
		border-color: var(--theme-gold, #ffbc0d);
		color: #022659;
		font-weight: 800;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
	}

	.next-btn:hover:not(:disabled) {
		background: var(--theme-gold-shimmer, #ffbc0d);
		color: #022659;
		transform: translateY(-1px);
		filter: brightness(1.05);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}

	/* Right Sidebar Tracker */
	.sidebar-tracker {
		width: 180px;
		flex-shrink: 0;
		align-self: start;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0;
		background: transparent;
		border: none;
	}

	.tracker-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
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

	/* Simple 5x2 Dots Grid */
	.dots-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
	}

	.dot-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.25rem;
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-sm);
		background: var(--theme-paper);
		color: var(--theme-text-muted);
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 2px 8px rgba(0, 15, 45, 0.2);
	}

	.dot-btn:hover {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		border-color: rgba(255, 188, 13, 0.45);
		color: #ffffff;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 20, 60, 0.35);
	}

	.dot-btn:active {
		transform: translateY(1px);
		filter: brightness(0.96);
	}

	/* Answered Dot */
	.dot-btn.done {
		background: var(--theme-gold-shimmer);
		border-color: var(--theme-gold);
		color: #022659;
		font-weight: 900;
		box-shadow:
			0 3px 10px rgba(255, 188, 13, 0.35),
			inset 0 1px 1px rgba(255, 255, 255, 0.5);
	}

	.dot-btn.done:hover {
		filter: brightness(1.06);
		color: #022659;
		box-shadow:
			0 5px 14px rgba(255, 188, 13, 0.45),
			inset 0 1px 1px rgba(255, 255, 255, 0.6);
	}

	/* Current Active Dot */
	.dot-btn.current {
		outline: 2px solid var(--theme-gold);
		outline-offset: 1px;
	}

	/* Responsive Mobile-First Quiz Layout */
	@media (max-width: 768px) {
		:global(.page-shell.quiz-page-shell) {
			height: 100dvh !important;
			max-height: 100dvh !important;
			min-height: 100dvh !important;
			overflow: hidden !important;
			padding: 0 !important;
			display: flex !important;
			flex-direction: column !important;
			align-items: stretch !important;
			justify-content: flex-start !important;
		}

		.quiz-container {
			display: flex;
			flex-direction: column;
			width: 100%;
			max-width: 100%;
			height: 100%;
			margin: 0 !important;
			gap: 0;
			overflow: hidden;
		}

		.quiz-content {
			display: flex;
			flex-direction: column;
			height: 100%;
			min-height: 0;
			width: 100%;
			gap: 0;
		}

		/* Hide desktop-only sidebar tracker on mobile */
		.sidebar-tracker {
			display: none;
		}

		/* Pinned High-Contrast Header */
		.quiz-header {
			flex-shrink: 0;
			background: var(--theme-paper);
			border-bottom: 1px solid var(--theme-border);
			padding: 0.6rem 0.85rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			z-index: 20;
			box-shadow: none; /* Clean flat border, no fuzzy drop shadow */
		}

		.header-exit-btn {
			padding: 0.35rem 0.65rem;
			font-size: 0.78rem;
			font-weight: 700;
			background: #dc2626;
			border: 1px solid #dc2626;
			color: #ffffff;
			border-radius: var(--radius-sm);
			box-shadow: 0 1px 3px rgba(220, 38, 38, 0.25);
			flex-shrink: 0;
		}

		.header-center {
			display: flex;
			align-items: center;
			gap: 0.65rem;
			flex-shrink: 0;
		}

		.header-dot {
			font-size: 0.7rem;
			color: var(--theme-border);
			opacity: 0.5;
		}

		.level-indicator {
			font-size: 0.75rem;
			font-weight: 800;
			color: var(--theme-gold);
			letter-spacing: 0.08em;
		}

		.header-right-spacer {
			width: 42px; /* Leaves room for ThemeToggle in top right corner */
			flex-shrink: 0;
		}

		/* Top Progress Line - Clean 2px line with transparent track (no lighter color) */
		.quiz-progress-line {
			display: block;
			flex-shrink: 0;
			width: 100%;
			height: 2px;
			background: transparent;
			overflow: hidden;
			z-index: 20;
		}

		.quiz-progress-fill {
			height: 100%;
			background: var(--theme-gold);
			transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		}

		/* Question form / body - Scrollable Middle Area */
		.question-body {
			flex: 1;
			min-height: 0;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			padding: 1rem 1rem 5.5rem 1rem;
			display: flex;
			flex-direction: column;
			gap: 1.15rem;
		}

		.prompt-zone {
			display: flex;
			flex-direction: column;
			gap: 0.45rem;
			width: 100%;
			padding-bottom: 1rem;
			border-bottom: 1px solid var(--theme-border);
			flex-shrink: 0;
		}

		.format-text {
			font-size: 0.75rem;
			font-weight: 800;
			letter-spacing: 0.08em;
			color: var(--theme-gold);
		}

		.prompt-japanese {
			font-size: clamp(1.25rem, 5vw, 1.6rem);
			line-height: 1.45;
		}

		.answer-zone {
			display: flex;
			flex-direction: column;
			gap: 0.85rem;
			flex: 1;
			min-height: 0;
		}

		/* Choices list */
		.choices-list {
			gap: 0.6rem;
		}

		.choice-item {
			padding: 0.8rem 1rem;
			min-height: 3.35rem;
			gap: 0.75rem;
		}

		.choice-letter {
			width: 1.85rem;
			height: 1.85rem;
			font-size: 0.82rem;
		}

		.choice-text {
			font-size: 1.05rem;
			line-height: 1.35;
		}

		/* Word ordering: REMOVE outer container box */
		.word-ordering-group {
			background: transparent;
			border: none;
			padding: 0;
			box-shadow: none;
			gap: 0.75rem;
		}

		.standalone-sentence-line {
			min-height: 3.4rem;
			padding: 0.6rem 0.75rem;
			gap: 0.45rem;
		}

		.word-chip {
			padding: 0.55rem 0.95rem;
			font-size: 1.02rem;
			min-height: 42px;
		}

		.typing-hint {
			font-size: 0.75rem;
		}

		/* Typing */
		.typing-input {
			padding: 0.85rem 1rem;
			font-size: 1.1rem;
			min-height: 48px;
		}

		/* Bottom Navigation: FIXED AT BOTTOM, ALWAYS IN SAME PLACE */
		.bottom-actions {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 30;
			background: var(--theme-paper);
			border-top: 1px solid var(--theme-border);
			padding: 0.6rem 0.75rem calc(0.6rem + env(safe-area-inset-bottom, 0px)) 0.75rem;
			margin: 0;
			box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.12);
			display: grid;
			grid-template-columns: 1fr 1.15fr 1fr;
			align-items: center;
			gap: 0.55rem;
		}

		:global([data-theme='dark']) .bottom-actions {
			background: var(--theme-paper);
		}

		.prev-btn,
		.next-btn,
		.picker-trigger-btn {
			width: 100%;
			height: 42px;
			min-height: 42px;
			max-height: 42px;
			justify-content: center;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
		}

		.prev-btn,
		.next-btn {
			font-size: 0.85rem;
		}

		.picker-trigger-btn {
			padding: 0 0.35rem;
			gap: 0.35rem;
		}

		/* Question selector on mobile: Clean Full-Screen Overview */
		.selector-backdrop {
			padding: 0;
		}

		.selector-modal {
			width: 100vw;
			height: 100dvh;
			max-height: 100dvh;
			border-radius: 0;
			border: none;
			background: var(--theme-background);
		}

		.selector-header {
			padding: 0.85rem 1rem;
			border-bottom: 1px solid var(--theme-border);
			background: var(--theme-paper);
		}

		.selector-title {
			font-size: 1.05rem;
		}

		.picker-scroll-container {
			padding: 0.75rem 0.85rem calc(1.5rem + env(safe-area-inset-bottom, 0px)) 0.85rem;
		}

		.picker-rows-list {
			gap: 0.45rem;
		}

		.picker-row {
			min-height: 48px;
			padding: 0.65rem 0.75rem;
			gap: 0.65rem;
		}

		.row-num {
			font-size: 0.82rem;
		}

		.row-prompt {
			font-size: 0.88rem;
		}

		/* Exit Modal */
		.modal-backdrop {
			padding: 1rem;
		}

		.exit-modal {
			width: min(100%, 320px);
			padding: 1.5rem 1.15rem;
			gap: 0.75rem;
		}

		.modal-title {
			font-size: 1.1rem;
		}

		.modal-desc {
			font-size: 0.82rem;
		}

		.modal-btn {
			min-height: 44px;
			font-size: 0.82rem;
		}
	}

	/* Exit Warning Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgba(0, 5, 20, 0.72);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		animation: fadeIn 0.15s ease;
	}

	.exit-modal {
		width: min(100%, 380px);
		background: var(--theme-paper);
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-md);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
		padding: 2rem 1.5rem;
		text-align: center;
		display: grid;
		gap: 0.85rem;
		animation: popIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.modal-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--theme-text-main);
	}

	.modal-desc {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--theme-text-muted);
	}

	.modal-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-top: 0.6rem;
	}

	.modal-btn {
		padding: 0.65rem 1rem;
		border-radius: var(--radius-md);
		font-size: 0.88rem;
		font-weight: 700;
		cursor: pointer;
		text-align: center;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		position: relative;
		overflow: hidden;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 4px 14px rgba(0, 15, 45, 0.25);
		user-select: none;
	}

	/* Metallic shine sweep */
	.modal-btn::after {
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

	.modal-btn:hover::after {
		left: 150%;
		transition: left 3.4s cubic-bezier(0.2, 0.8, 0.25, 1);
	}

	.cancel-btn {
		border: 1px solid var(--theme-border);
		background: transparent;
		color: var(--theme-text-main);
	}

	.cancel-btn:hover {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		color: #ffffff;
		transform: translateY(-1.5px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
	}

	.cancel-btn:active {
		transform: translateY(0.5px);
		filter: brightness(0.96);
	}

	.confirm-btn {
		border: 1px solid #ef4444;
		background: #ef4444;
		color: #ffffff;
	}

	.confirm-btn:hover {
		background: #dc2626;
		transform: translateY(-1.5px);
		filter: brightness(1.05);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
	}

	.confirm-btn:active {
		transform: translateY(0.5px);
		filter: brightness(0.96);
	}

	/* Question Selector Modal */
	.selector-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgba(1, 4, 9, 0.82);
		backdrop-filter: blur(6px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		animation: fadeIn 0.15s ease;
	}

	.selector-modal {
		width: min(100%, 560px);
		height: 80vh;
		max-height: 80vh;
		background: var(--theme-card);
		border: 1px solid var(--theme-border);
		border-radius: var(--radius-md);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: popIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.selector-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.95rem 1.25rem;
		border-bottom: 1px solid var(--theme-border);
		background: var(--theme-paper);
		flex-shrink: 0;
	}

	.selector-header-info {
		display: flex;
		align-items: baseline;
		gap: 0.85rem;
		flex-wrap: wrap;
	}

	.selector-title {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 800;
		color: var(--theme-text-main);
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
	}

	.selector-title-en {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--theme-gold);
	}

	.selector-count-badge {
		font-size: 0.76rem;
		font-weight: 700;
		color: var(--theme-text-muted);
		background: rgba(0, 0, 0, 0.25);
		padding: 0.2rem 0.55rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--theme-border);
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.selector-count-badge i {
		color: var(--theme-success);
		font-size: 0.72rem;
	}

	.selector-close-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-sm);
		background: #dc2626;
		border: 1px solid #dc2626;
		color: #ffffff;
		font-size: 1rem;
		cursor: pointer;
		box-shadow: 0 1px 4px rgba(220, 38, 38, 0.3);
		transition: all 0.15s ease;
	}

	.selector-close-btn:hover {
		background: #b91c1c;
		border-color: #b91c1c;
		color: #ffffff;
		transform: translateY(-1px);
		box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4);
	}

	.selector-close-btn:active {
		transform: translateY(0);
	}

	/* Scrollable List Container with Permanent High-Contrast Scroll Indicator */
	.picker-scroll-container {
		flex: 1;
		min-height: 0;
		overflow-y: scroll; /* Forces scrollbar gutter to always remain visible */
		scrollbar-width: thin;
		scrollbar-color: var(--theme-gold) var(--theme-card);
		padding: 0.85rem 1.15rem 1.25rem 1.15rem;
	}

	.picker-scroll-container::-webkit-scrollbar {
		width: 7px;
	}

	.picker-scroll-container::-webkit-scrollbar-track {
		background: var(--theme-card);
		border-left: 1px solid var(--theme-border);
	}

	.picker-scroll-container::-webkit-scrollbar-thumb {
		background: var(--theme-gold);
		border-radius: var(--radius-pill);
		border: 1px solid var(--theme-border);
	}

	.picker-scroll-container::-webkit-scrollbar-thumb:hover {
		background: var(--theme-gold-shimmer, #ffd043);
	}

	.picker-rows-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* Question Row Item */
	.picker-row {
		display: grid;
		grid-template-columns: 2.2rem 1fr auto;
		align-items: center;
		gap: 0.75rem;
		min-height: 48px;
		padding: 0.65rem 0.85rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--theme-border);
		background: var(--theme-paper);
		cursor: pointer;
		text-align: left;
		transition:
			background 0.15s ease,
			border-color 0.15s ease;
		width: 100%;
		box-sizing: border-box;
		position: relative;
	}

	.picker-row:hover {
		background: color-mix(in srgb, var(--theme-paper) 75%, #1952a8 25%);
		border-color: var(--theme-gold);
	}

	.picker-row.is-current {
		background: var(--theme-gold-shimmer, #ffbc0d);
		border-color: var(--theme-gold, #ffbc0d);
		color: #022659;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	}

	.picker-row.is-current:hover {
		background: var(--theme-gold-shimmer, #ffbc0d);
		filter: brightness(1.04);
	}

	.picker-row.is-done {
		border-color: rgba(34, 197, 94, 0.35);
	}

	.row-num {
		font-size: 0.88rem;
		font-weight: 800;
		color: var(--theme-text-muted);
		letter-spacing: 0.04em;
	}

	.picker-row.is-current .row-num {
		color: #022659;
		font-weight: 900;
	}

	.row-content {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	.row-prompt {
		font-size: 0.92rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--theme-text-main);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.picker-row.is-current .row-prompt {
		color: #022659;
		font-weight: 700;
	}

	.row-format-tag {
		font-size: 0.68rem;
		font-weight: 700;
		color: var(--theme-gold);
		opacity: 0.85;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.picker-row.is-current .row-format-tag {
		color: #022659;
		opacity: 0.8;
		font-weight: 800;
	}

	.row-status {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.current-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.45rem;
		border-radius: var(--radius-sm);
		background: #022659;
		color: var(--theme-gold, #ffbc0d);
		font-size: 0.68rem;
		font-weight: 900;
		letter-spacing: 0.06em;
	}

	.done-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.45rem;
		height: 1.45rem;
		border-radius: 50%;
		background: #22c55e;
		border: 1px solid #16a34a;
		color: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.done-check-icon {
		color: #ffffff;
		font-size: 0.75rem;
		line-height: 1;
	}

	.pending-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		color: var(--theme-text-muted);
		opacity: 0.4;
		font-size: 0.72rem;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
