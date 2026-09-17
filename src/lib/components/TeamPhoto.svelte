<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { TeamMember } from '$lib/credits';

	interface Props {
		members: TeamMember[];
		activeMemberId?: string | null;
		onselect?: (memberId: string) => void;
	}

	let { members = [], activeMemberId = $bindable(null), onselect }: Props = $props();

	let containerEl: HTMLDivElement | null = $state(null);
	let hitCanvases: SvelteMap<
		string,
		{ ctx: CanvasRenderingContext2D; width: number; height: number }
	> = new SvelteMap();
	let isHitmapReady = $state(false);

	const CANVAS_WIDTH = 640;
	const CANVAS_HEIGHT = 476.5;

	const hitTestOrder = ['vathana', 'lyleab', 'panha', 'karona', 'menghour', 'virakbot'];

	let sortedMembers = $derived(
		[...members].sort((a, b) => {
			const indexA = hitTestOrder.indexOf(a.id);
			const indexB = hitTestOrder.indexOf(b.id);

			return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
		})
	);

	onMount(() => {
		let loadedCount = 0;
		const totalMembers = members.length;

		if (totalMembers === 0) {
			isHitmapReady = true;
			return;
		}

		members.forEach((member) => {
			if (!member.cutoutUrl) {
				loadedCount++;

				if (loadedCount >= totalMembers) {
					isHitmapReady = true;
				}

				return;
			}

			const canvas = document.createElement('canvas');
			canvas.width = CANVAS_WIDTH;
			canvas.height = CANVAS_HEIGHT;

			const ctx = canvas.getContext('2d', { willReadFrequently: true });

			if (!ctx) {
				loadedCount++;

				if (loadedCount >= totalMembers) {
					isHitmapReady = true;
				}

				return;
			}

			const img = new Image();
			img.crossOrigin = 'anonymous';

			img.onload = () => {
				ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

				hitCanvases.set(member.id, {
					ctx,
					width: CANVAS_WIDTH,
					height: CANVAS_HEIGHT
				});

				loadedCount++;

				if (loadedCount >= totalMembers) {
					isHitmapReady = true;
				}
			};

			img.onerror = () => {
				loadedCount++;

				if (loadedCount >= totalMembers) {
					isHitmapReady = true;
				}
			};

			img.src = member.cutoutUrl;
		});
	});

	function getMemberAtPoint(clientX: number, clientY: number): string | null {
		if (!containerEl) return null;

		const rect = containerEl.getBoundingClientRect();

		const scaleX = 1280 / rect.width;
		const scaleY = 953 / rect.height;

		const svgX = (clientX - rect.left) * scaleX;
		const svgY = (clientY - rect.top) * scaleY;

		if (svgX < 0 || svgX > 1280 || svgY < 0 || svgY > 953) {
			return null;
		}

		const canvasX = Math.floor((svgX / 1280) * CANVAS_WIDTH);
		const canvasY = Math.floor((svgY / 953) * CANVAS_HEIGHT);

		for (const member of sortedMembers) {
			const box = member.box;

			if (
				svgX >= box.x &&
				svgX <= box.x + box.width &&
				svgY >= box.y &&
				svgY <= box.y + box.height
			) {
				const hitData = hitCanvases.get(member.id);

				if (hitData && isHitmapReady) {
					try {
						const pixel = hitData.ctx.getImageData(canvasX, canvasY, 1, 1).data;

						if (pixel[3] > 40) {
							return member.id;
						}
					} catch {
						return member.id;
					}
				} else {
					return member.id;
				}
			}
		}

		return null;
	}

	/**
	 * Members are navigated in the order they were passed in (the credits list
	 * order), not hitTestOrder. hitTestOrder is only used to resolve overlapping
	 * silhouettes when clicking.
	 */
	const activeIndex = $derived(members.findIndex((member) => member.id === activeMemberId));

	function selectMember(memberId: string) {
		activeMemberId = memberId;
		onselect?.(memberId);
	}

	function selectByOffset(offset: number) {
		if (members.length === 0) return;

		const nextIndex =
			activeIndex === -1
				? offset > 0
					? 0
					: members.length - 1
				: (activeIndex + offset + members.length) % members.length;

		selectMember(members[nextIndex].id);
	}

	function handleWindowKeyDown(event: KeyboardEvent) {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

		const target = event.target as HTMLElement | null;

		if (
			target &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
		) {
			return;
		}

		event.preventDefault();

		selectByOffset(event.key === 'ArrowRight' ? 1 : -1);
	}

	function handlePointerDown(event: PointerEvent) {
		const memberId = getMemberAtPoint(event.clientX, event.clientY);

		if (memberId) {
			selectMember(memberId);
		}
	}

	function handleKeyDown(event: KeyboardEvent, memberId: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectMember(memberId);
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeyDown} />

<div class="team-photo-wrapper">
	<div
		class="photo-frame"
		bind:this={containerEl}
		onpointerdown={handlePointerDown}
		role="region"
		aria-label="Interactive Team Portrait"
	>
		<svg
			viewBox="0 0 1280 953"
			class="team-svg"
			preserveAspectRatio="xMidYMid meet"
			aria-label="Japanese Quiz Game Development Team Photo"
		>
			<image
				href="/images/team/team-with-background.webp"
				x="0"
				y="0"
				width="1280"
				height="953"
				class="base-image"
				class:dimmed={activeMemberId !== null}
			/>

			{#each members as member (member.id)}
				<g
					class="member-layer"
					class:active={activeMemberId === member.id}
					class:dimmed={activeMemberId !== null && activeMemberId !== member.id}
					tabindex="0"
					role="button"
					aria-label="{member.name} - {member.role}"
					onkeydown={(event) => handleKeyDown(event, member.id)}
				>
					{#if member.cutoutUrl}
						<image
							href={member.cutoutUrl}
							x="0"
							y="0"
							width="1280"
							height="953"
							class="member-cutout"
						/>
					{/if}
				</g>
			{/each}
		</svg>
	</div>

	<div class="member-nav">
		<button
			type="button"
			class="nav-arrow"
			onclick={() => selectByOffset(-1)}
			aria-label="Previous team member"
		>
			<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
		</button>

		<button
			type="button"
			class="nav-arrow"
			onclick={() => selectByOffset(1)}
			aria-label="Next team member"
		>
			<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
		</button>
	</div>
</div>

<style>
	.team-photo-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.photo-frame {
		position: relative;
		width: 100%;
		aspect-ratio: 1280 / 953;
		border-radius: var(--radius-lg, 1rem);
		overflow: hidden;
		background: rgba(0, 15, 45, 0.7);
		border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.15));
		box-shadow:
			0 12px 32px rgba(0, 15, 45, 0.5),
			0 0 0 1px rgba(255, 188, 13, 0.12),
			inset 0 0 24px rgba(0, 0, 0, 0.35);
		backdrop-filter: blur(12px);
		cursor: pointer;
		touch-action: none;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.photo-frame:hover {
		border-color: rgba(255, 188, 13, 0.35);
		box-shadow:
			0 16px 40px rgba(0, 15, 45, 0.6),
			0 0 20px rgba(255, 188, 13, 0.2),
			inset 0 0 24px rgba(0, 0, 0, 0.35);
	}

	.team-svg {
		width: 100%;
		height: 100%;
		display: block;
		user-select: none;
		pointer-events: none;
	}

	.base-image {
		transition: filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.base-image.dimmed {
		filter: brightness(0.65) saturate(0.82);
	}

	.member-layer {
		outline: none;
		pointer-events: none;
	}

	.member-cutout {
		opacity: 0;
		transition:
			opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.28s cubic-bezier(0.16, 1, 0.3, 1);
		transform-origin: center bottom;
	}

	.member-layer.active .member-cutout {
		opacity: 1;
		filter: drop-shadow(0 0 14px var(--theme-gold, #ffbc0d))
			drop-shadow(0 0 30px rgba(255, 188, 13, 0.75)) brightness(1.1);
	}

	.member-layer.dimmed .member-cutout {
		opacity: 0;
	}

	.member-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.nav-arrow {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 50%;
		cursor: pointer;
		color: var(--theme-gold, #ffbc0d);
		background: rgba(0, 15, 45, 0.7);
		border: 1px solid rgba(255, 188, 13, 0.35);
		transition:
			background 0.25s ease,
			border-color 0.25s ease,
			transform 0.25s ease;
	}

	.nav-arrow:hover {
		background: rgba(255, 188, 13, 0.16);
		border-color: rgba(255, 188, 13, 0.7);
		transform: scale(1.06);
	}

	.nav-arrow:focus-visible {
		outline: 2px solid var(--theme-gold, #ffbc0d);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-arrow {
			transition: none !important;
		}

		.base-image,
		.member-cutout {
			transition: none !important;
		}
	}
</style>
