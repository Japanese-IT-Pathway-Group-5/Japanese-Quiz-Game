<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { TeamMember } from '$lib/credits';

	interface Props {
		members: TeamMember[];
		activeMemberId?: string | null;
		onselect?: (memberId: string) => void;
		onhover?: (memberId: string | null) => void;
	}

	let { members = [], activeMemberId = $bindable(null), onselect, onhover }: Props = $props();

	let containerEl: HTMLDivElement | null = $state(null);
	let hitCanvases: SvelteMap<
		string,
		{ ctx: CanvasRenderingContext2D; width: number; height: number }
	> = new SvelteMap();
	let isHitmapReady = $state(false);

	let leaveTimeout: ReturnType<typeof setTimeout> | null = null;
	let switchTimeout: ReturnType<typeof setTimeout> | null = null;
	let rafId: number | null = null;
	let lastPointerEvent: { clientX: number; clientY: number } | null = null;

	const CANVAS_WIDTH = 640;
	const CANVAS_HEIGHT = 476.5;

	// Priority order for hit testing (foreground members first)
	const hitTestOrder = ['vathana', 'lyleab', 'panha', 'karona', 'menghour', 'virakbot'];

	// Pre-sort members once
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

		members.forEach((member) => {
			if (!member.cutoutUrl) return;

			const canvas = document.createElement('canvas');
			canvas.width = CANVAS_WIDTH;
			canvas.height = CANVAS_HEIGHT;
			const ctx = canvas.getContext('2d', { willReadFrequently: true });

			if (!ctx) return;

			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => {
				ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
				hitCanvases.set(member.id, { ctx, width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
				loadedCount++;
				if (loadedCount >= totalMembers) {
					isHitmapReady = true;
				}
			};
			img.src = member.cutoutUrl;
		});
	});

	onDestroy(() => {
		if (leaveTimeout) clearTimeout(leaveTimeout);
		if (switchTimeout) clearTimeout(switchTimeout);
		if (rafId !== null) cancelAnimationFrame(rafId);
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

	function processPointer(clientX: number, clientY: number) {
		const detectedId = getMemberAtPoint(clientX, clientY);

		if (detectedId) {
			if (leaveTimeout) {
				clearTimeout(leaveTimeout);
				leaveTimeout = null;
			}

			if (detectedId !== activeMemberId) {
				if (switchTimeout) clearTimeout(switchTimeout);
				switchTimeout = setTimeout(() => {
					activeMemberId = detectedId;
					onhover?.(detectedId);
				}, 25);
			}
		} else {
			if (switchTimeout) {
				clearTimeout(switchTimeout);
				switchTimeout = null;
			}

			if (activeMemberId !== null && !leaveTimeout) {
				leaveTimeout = setTimeout(() => {
					activeMemberId = null;
					onhover?.(null);
					leaveTimeout = null;
				}, 120);
			}
		}
	}

	function handlePointerMove(event: PointerEvent) {
		lastPointerEvent = { clientX: event.clientX, clientY: event.clientY };
		if (rafId === null) {
			rafId = requestAnimationFrame(() => {
				rafId = null;
				if (lastPointerEvent) {
					processPointer(lastPointerEvent.clientX, lastPointerEvent.clientY);
				}
			});
		}
	}

	function handlePointerLeave() {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
		if (switchTimeout) {
			clearTimeout(switchTimeout);
			switchTimeout = null;
		}

		if (leaveTimeout) clearTimeout(leaveTimeout);
		leaveTimeout = setTimeout(() => {
			if (activeMemberId !== null) {
				activeMemberId = null;
				onhover?.(null);
			}
			leaveTimeout = null;
		}, 120);
	}

	function handlePointerDown(event: PointerEvent) {
		const memberId = getMemberAtPoint(event.clientX, event.clientY);
		if (memberId) {
			if (switchTimeout) clearTimeout(switchTimeout);
			if (leaveTimeout) clearTimeout(leaveTimeout);
			activeMemberId = memberId;
			onselect?.(memberId);
		}
	}

	function handleKeyDown(event: KeyboardEvent, memberId: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onselect?.(memberId);
		}
	}
</script>

<div class="team-photo-wrapper">
	<!-- Interactive SVG canvas container -->
	<div
		class="photo-frame"
		bind:this={containerEl}
		onpointermove={handlePointerMove}
		onpointerleave={handlePointerLeave}
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
			<!-- Base team illustration with background -->
			<image
				href="/images/team/team-with-background.png"
				x="0"
				y="0"
				width="1280"
				height="953"
				class="base-image"
				class:dimmed={activeMemberId !== null}
			/>

			<!-- Overlay cutout layers for each member -->
			{#each members as member (member.id)}
				<g
					class="member-layer"
					class:active={activeMemberId === member.id}
					class:dimmed={activeMemberId !== null && activeMemberId !== member.id}
					tabindex="0"
					role="button"
					aria-label="{member.name} - {member.role}"
					onfocus={() => {
						activeMemberId = member.id;
						onhover?.(member.id);
					}}
					onblur={() => {
						activeMemberId = null;
						onhover?.(null);
					}}
					onkeydown={(e) => handleKeyDown(e, member.id)}
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

	/* Exact contour glow on the cutout silhouette when hovered */
	.member-layer.active .member-cutout {
		opacity: 1;
		filter: drop-shadow(0 0 14px var(--theme-gold, #ffbc0d))
			drop-shadow(0 0 30px rgba(255, 188, 13, 0.75)) brightness(1.1);
	}

	.member-layer.dimmed .member-cutout {
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.base-image,
		.member-cutout {
			transition: none !important;
		}
	}
</style>
