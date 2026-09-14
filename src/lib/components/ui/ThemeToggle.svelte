<script lang="ts">
	import { onMount } from 'svelte';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
	import type { DotLottie } from '@lottiefiles/dotlottie-svelte';

	let isDark = $state(false);
	let dotLottie: DotLottie | null = $state(null);
	let isInitialized = false;

	// The animation toggle segment is between frame 0 (Night/Moon) and frame 40 (Day/Sun)
	const NIGHT_FRAME = 0;
	const DAY_FRAME = 40;

	onMount(() => {
		isDark =
			document.documentElement.classList.contains('dark') ||
			document.documentElement.getAttribute('data-theme') === 'dark';
	});

	function syncInitialFrame() {
		if (!dotLottie || isInitialized) return;
		if (dotLottie.isLoaded) {
			dotLottie.setFrame(isDark ? NIGHT_FRAME : DAY_FRAME);
			isInitialized = true;
		}
	}

	$effect(() => {
		if (dotLottie) {
			dotLottie.addEventListener('load', syncInitialFrame);
			dotLottie.addEventListener('ready', syncInitialFrame);
			if (dotLottie.isLoaded) {
				syncInitialFrame();
			}

			return () => {
				dotLottie?.removeEventListener('load', syncInitialFrame);
				dotLottie?.removeEventListener('ready', syncInitialFrame);
			};
		}
	});

	function applyThemeToDOM(darkMode: boolean) {
		if (darkMode) {
			document.documentElement.classList.add('dark');
			document.documentElement.setAttribute('data-theme', 'dark');
			try {
				localStorage.setItem('theme', 'dark');
			} catch (err) {
				console.warn('Unable to persist theme to localStorage', err);
			}
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.setAttribute('data-theme', 'light');
			try {
				localStorage.setItem('theme', 'light');
			} catch (err) {
				console.warn('Unable to persist theme to localStorage', err);
			}
		}
	}

	function toggleTheme() {
		const willBeDark = !isDark;
		isDark = willBeDark;

		// Use View Transitions API if supported for butter-smooth GPU transition
		if (typeof document !== 'undefined' && 'startViewTransition' in document) {
			document.startViewTransition(() => {
				applyThemeToDOM(willBeDark);
			});
		} else {
			applyThemeToDOM(willBeDark);
		}

		if (dotLottie) {
			try {
				dotLottie.setSpeed(2.0);
				if (willBeDark) {
					// Transitioning from Day (40) -> Night (0)
					dotLottie.setMode('reverse');
					dotLottie.setSegment(NIGHT_FRAME, DAY_FRAME);
					dotLottie.play();
				} else {
					// Transitioning from Night (0) -> Day (40)
					dotLottie.setMode('forward');
					dotLottie.setSegment(NIGHT_FRAME, DAY_FRAME);
					dotLottie.play();
				}
			} catch (err) {
				console.error('Lottie toggle error:', err);
			}
		}
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={isDark}
	onclick={toggleTheme}
	class="theme-toggle-btn"
	title={isDark ? 'Switch to Daylight Edition' : 'Switch to Tsukimi Night Edition'}
	aria-label="Toggle theme"
>
	<div class="lottie-switch">
		<DotLottieSvelte
			src="/animations/dark-mode.lottie"
			dotLottieRefCallback={(instance) => {
				dotLottie = instance;
			}}
			autoplay={false}
			loop={false}
		/>
	</div>
</button>

<style>
	.theme-toggle-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		user-select: none;
		transition: transform 0.15s ease;
		flex-shrink: 0;
	}

	.theme-toggle-btn:hover {
		transform: scale(1.05);
	}

	.theme-toggle-btn:active {
		transform: scale(0.96);
	}

	.theme-toggle-btn:focus-visible {
		outline: 2px solid var(--theme-gold);
		outline-offset: 3px;
		border-radius: var(--radius-pill);
	}

	/* Aspect ratio matches the animation's native 1920x1080 (16:9) frame */
	.lottie-switch {
		width: 68px;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		pointer-events: none;
	}

	:global(.lottie-switch canvas),
	:global(.lottie-switch > *) {
		width: 100% !important;
		height: 100% !important;
		object-fit: contain;
		pointer-events: none;
	}

	@media (max-width: 640px) {
		.lottie-switch {
			width: 48px;
			height: 27px;
		}
	}
</style>
