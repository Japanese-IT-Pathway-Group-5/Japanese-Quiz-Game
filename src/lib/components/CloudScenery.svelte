<script lang="ts">
	// Complete Japanese sky scenery with clouds, upper wind breeze, and lower leaf breeze
</script>

<div class="clouds-backdrop" aria-hidden="true">
	<!-- Top-Center: Soft Radiating Sunbeams / Lunar Rays (Behind Celestial Disk) -->
	<div class="art-layer sunbeam-layer light-beams"></div>
	<div class="art-layer sunbeam-layer dark-beams"></div>

	<!-- Top-Center: Japanese Celestial Disk (Sun in Light Mode / Moon in Dark Mode) -->
	<div class="art-layer sun-layer">
		<img src="/images/sun.webp" alt="" class="art-img sun-img" loading="eager" decoding="async" />
		<img src="/images/moon.webp" alt="" class="art-img moon-img" loading="eager" decoding="async" />
	</div>

	<div class="art-layer sfx-layer sun-sfx" aria-hidden="true">
		<span class="sfx-text sfx-left font-brush">ジリジリ</span>
		<span class="sfx-text sfx-right font-brush">ジリジリ</span>
	</div>

	<div class="art-layer sfx-layer moon-sfx" aria-hidden="true">
		<span class="sfx-text sfx-left font-brush">しーん</span>
		<span class="sfx-text sfx-right font-brush">しーん</span>
	</div>

	<!-- Top-Left: Double Cloud -->
	<div class="art-layer cloud-top-left">
		<img src="/images/cloud-double.svg" alt="" class="art-img" loading="eager" decoding="async" />
	</div>

	<!-- Top-Right: Distant Lone Cloud -->
	<div class="art-layer cloud-top-right">
		<img
			src="/images/small-lone-cloud.svg"
			alt=""
			class="art-img"
			loading="eager"
			decoding="async"
		/>
	</div>

	<!-- Upper-Right: Sleek Wind Line Stream -->
	<div class="art-layer wind-top-right">
		<img
			src="/images/wind-line-single.svg"
			alt=""
			class="art-img"
			loading="eager"
			decoding="async"
		/>
	</div>

	<!-- Mid-Right: Horizon Cloud -->
	<div class="art-layer cloud-mid-right">
		<img src="/images/cloud.svg" alt="" class="art-img" loading="eager" decoding="async" />
	</div>

	<!-- Bottom-Left: Wind-Blown Leaf Breeze -->
	<div class="art-layer leaf-breeze-bottom">
		<img
			src="/images/leaf-blow-with-wind.webp"
			alt=""
			class="art-img"
			loading="eager"
			decoding="async"
		/>
	</div>
</div>

<style>
	.clouds-backdrop {
		position: fixed;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		z-index: 0;
		user-select: none;
	}

	.art-layer {
		position: absolute;
		transition: opacity 0.3s ease;
		filter: drop-shadow(0 10px 25px rgba(0, 15, 45, 0.2));
	}

	.art-img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
	}

	/* ==========================================================================
	   Harmonious Layout
	   ========================================================================== */

	/* 0a. Full-Bleed Distance-Faded Sunbeams (Pronounced Falloff) */
	.sunbeam-layer {
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 250vmax;
		height: 250vmax;
		border-radius: 50%;
		pointer-events: none;
		z-index: 0;
		transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		mask-image: radial-gradient(
			circle at 50% 50%,
			rgba(0, 0, 0, 1) 0px,
			rgba(0, 0, 0, 0.85) 120px,
			rgba(0, 0, 0, 0.45) 280px,
			rgba(0, 0, 0, 0.18) 480px,
			rgba(0, 0, 0, 0.04) 700px,
			transparent 920px
		);
		-webkit-mask-image: radial-gradient(
			circle at 50% 50%,
			rgba(0, 0, 0, 1) 0px,
			rgba(0, 0, 0, 0.85) 120px,
			rgba(0, 0, 0, 0.45) 280px,
			rgba(0, 0, 0, 0.18) 480px,
			rgba(0, 0, 0, 0.04) 700px,
			transparent 920px
		);
	}

	.light-beams {
		opacity: 1;
		background: repeating-conic-gradient(
			from 0deg at 50% 50%,
			rgba(255, 188, 13, 0.18) 0deg 9.5deg,
			transparent 9.5deg 22.5deg
		);
	}

	.dark-beams {
		opacity: 0;
		background: repeating-conic-gradient(
			from 0deg at 50% 50%,
			rgba(190, 220, 255, 0.075) 0deg 9.5deg,
			transparent 9.5deg 22.5deg
		);
	}

	/* 0b. Top-Center Japanese Celestial Disk (Sun in Light / Moon in Dark) */
	.sun-layer {
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
		width: clamp(150px, 22vw, 280px);
		height: clamp(150px, 22vw, 280px);
		border-radius: 50%;
		overflow: hidden;
		opacity: 0.94;
		z-index: 1;
		filter: drop-shadow(0 0 45px rgba(225, 111, 65, 0.5))
			drop-shadow(0 0 90px rgba(255, 188, 13, 0.25));
		animation: sun-pulse 20s ease-in-out infinite alternate;
		transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.sun-img,
	.moon-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		border-radius: 50%;
		mask-image: radial-gradient(circle at 50% 50%, black 65%, transparent 98%);
		-webkit-mask-image: radial-gradient(circle at 50% 50%, black 65%, transparent 98%);
		transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: opacity;
	}

	.sun-img {
		opacity: 0.95;
	}

	.moon-img {
		opacity: 0;
		transform: scale(1.89) translate(-1.1%, 3.4%);
		pointer-events: none;
	}

	/* 0c. Manga sound-effect text radiating from the celestial disk */
	.sfx-layer {
		top: 0;
		left: 50%;
		width: min(100vw, 920px);
		height: clamp(190px, 34vw, 380px);
		z-index: 3;
		transform: translateX(-50%);
		filter: drop-shadow(0 6px 14px rgba(0, 15, 45, 0.12));
		transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.sfx-text {
		position: absolute;
		display: inline-block;
		font-size: clamp(1.1rem, 2.5vw, 2rem);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1;
		white-space: nowrap;
		opacity: 0.6;
		text-shadow:
			0 1px 0 rgba(255, 255, 255, 0.15),
			0 6px 18px rgba(0, 15, 45, 0.18);
		--sfx-drift-x: 0px;
		--sfx-drift-y: 6px;
		animation: sfx-radiate 6.5s ease-in-out infinite alternate;
	}

	.sun-sfx {
		opacity: 1;
	}

	.sun-sfx .sfx-text {
		color: var(--theme-secondary);
		-webkit-text-stroke: 0.5px rgba(218, 41, 28, 0.38);
	}

	.moon-sfx {
		opacity: 0;
		pointer-events: none;
	}

	.moon-sfx .sfx-text {
		color: #dcecff;
		-webkit-text-stroke: 0.5px rgba(120, 170, 255, 0.22);
		text-shadow:
			0 1px 0 rgba(255, 255, 255, 0.06),
			0 0 16px rgba(180, 215, 255, 0.3);
		opacity: 0.5;
		animation-name: moon-sfx-radiate;
	}

	.sfx-left {
		top: clamp(5.6rem, 12vw, 9.4rem);
		left: clamp(-0.5rem, 12vw, 7.5rem);
		transform: rotate(-30deg);
		--sfx-drift-x: -8px;
		--sfx-drift-y: 9px;
	}

	.sfx-right {
		top: clamp(6.1rem, 13.5vw, 10.6rem);
		right: clamp(-1.5rem, 8vw, 5rem);
		transform: rotate(28deg);
		--sfx-drift-x: 7px;
		--sfx-drift-y: 10px;
		animation-delay: 0.6s;
	}

	/* 1. Top-Left Double Cloud */
	.cloud-top-left {
		top: 4%;
		left: -2%;
		width: clamp(140px, 20vw, 260px);
		opacity: 0.84;
		z-index: 2;
		animation: float-left 18s ease-in-out infinite alternate;
	}

	/* 2. Top-Right Distant Lone Cloud */
	.cloud-top-right {
		top: 5%;
		right: 14%;
		width: clamp(70px, 10vw, 130px);
		opacity: 0.7;
		z-index: 2;
		animation: float-right 14s ease-in-out infinite alternate;
	}

	/* 3. Upper-Right Sleek Wind Line Stream */
	.wind-top-right {
		top: 11%;
		right: 3%;
		width: clamp(160px, 22vw, 300px);
		opacity: 0.65;
		z-index: 2;
		animation: wind-sway 16s ease-in-out infinite alternate;
	}

	/* 4. Mid-Right Horizon Cloud */
	.cloud-mid-right {
		top: 48%;
		right: -1.5%;
		width: clamp(110px, 15vw, 200px);
		opacity: 0.78;
		z-index: 2;
		animation: float-mid 19s ease-in-out infinite alternate;
	}

	/* 5. Bottom-Left Leaf Breeze */
	.leaf-breeze-bottom {
		bottom: 3.5%;
		left: 2%;
		width: clamp(220px, 30vw, 420px);
		aspect-ratio: 1694 / 668;
		opacity: 0.88;
		z-index: 2;
		animation: breeze-sway 17s ease-in-out infinite alternate;
	}

	/* Dark Theme Subtlety & Moon Mode */
	:global([data-theme='dark']) .sun-img {
		opacity: 0;
		pointer-events: none;
	}

	:global([data-theme='dark']) .moon-img {
		opacity: 1;
		pointer-events: auto;
	}

	:global([data-theme='dark']) .sun-sfx {
		opacity: 0;
		pointer-events: none;
	}

	:global([data-theme='dark']) .moon-sfx {
		opacity: 1;
		pointer-events: auto;
	}

	:global([data-theme='dark']) .light-beams {
		opacity: 0;
	}

	:global([data-theme='dark']) .dark-beams {
		opacity: 0.45;
	}

	:global([data-theme='dark']) .sun-layer {
		opacity: 0.95;
		filter: drop-shadow(0 0 50px rgba(150, 195, 255, 0.55))
			drop-shadow(0 0 100px rgba(220, 240, 255, 0.28));
	}

	:global([data-theme='dark']) .cloud-top-left,
	:global([data-theme='dark']) .cloud-top-right,
	:global([data-theme='dark']) .cloud-mid-right {
		opacity: 0.38;
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
	}

	:global([data-theme='dark']) .wind-top-right {
		opacity: 0.25;
		filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.4));
	}

	:global([data-theme='dark']) .leaf-breeze-bottom {
		opacity: 0.45;
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
	}

	/* ==========================================================================
	   Keyframe Animations
	   ========================================================================== */

	@keyframes sun-pulse {
		0% {
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			transform: translate(-50%, -50%) scale(1.02);
		}
		100% {
			transform: translate(-50%, -50%) scale(0.98);
		}
	}

	@keyframes float-left {
		0% {
			transform: translate3d(0, 0, 0) rotate(0deg);
		}
		50% {
			transform: translate3d(10px, -10px, 0) rotate(0.6deg);
		}
		100% {
			transform: translate3d(-7px, -16px, 0) rotate(-0.4deg);
		}
	}

	@keyframes float-right {
		0% {
			transform: translate3d(0, 0, 0) rotate(0deg);
		}
		50% {
			transform: translate3d(-6px, 8px, 0) rotate(-0.6deg);
		}
		100% {
			transform: translate3d(8px, 12px, 0) rotate(0.5deg);
		}
	}

	@keyframes wind-sway {
		0% {
			transform: translate3d(0, 0, 0) scale(1);
		}
		50% {
			transform: translate3d(12px, -6px, 0) scale(1.02);
		}
		100% {
			transform: translate3d(-8px, 4px, 0) scale(0.98);
		}
	}

	@keyframes float-mid {
		0% {
			transform: translate3d(0, 0, 0);
		}
		50% {
			transform: translate3d(-8px, -6px, 0);
		}
		100% {
			transform: translate3d(6px, -12px, 0);
		}
	}

	@keyframes breeze-sway {
		0% {
			transform: translate3d(0, 0, 0) rotate(0deg);
		}
		50% {
			transform: translate3d(12px, -8px, 0) rotate(0.5deg);
		}
		100% {
			transform: translate3d(-8px, 6px, 0) rotate(-0.4deg);
		}
	}

	@keyframes sfx-radiate {
		0% {
			opacity: 0.44;
			translate: 0 0;
			scale: 0.98;
		}
		100% {
			opacity: 0.68;
			translate: var(--sfx-drift-x) var(--sfx-drift-y);
			scale: 1.02;
		}
	}

	@keyframes moon-sfx-radiate {
		0% {
			opacity: 0.32;
			translate: 0 0;
			scale: 0.98;
		}
		100% {
			opacity: 0.54;
			translate: calc(var(--sfx-drift-x) * 0.65) calc(var(--sfx-drift-y) * 0.65);
			scale: 1.015;
		}
	}

	/* ==========================================================================
	   Responsive Adjustments (Mobile)
	   ========================================================================== */

	@media (max-width: 768px) {
		.sun-layer {
			width: clamp(150px, 48vw, 260px);
			height: clamp(150px, 48vw, 260px);
		}

		.cloud-top-left {
			top: 1.5%;
			left: -8%;
			width: 38vw;
			opacity: 0.65;
		}

		.cloud-top-right {
			display: none;
		}

		.wind-top-right {
			top: 5%;
			right: -4%;
			width: 42vw;
			opacity: 0.55;
		}

		.cloud-mid-right {
			display: none;
		}

		.leaf-breeze-bottom {
			bottom: 2%;
			left: -4%;
			width: 50vw;
			opacity: 0.75;
		}

		.sfx-layer {
			width: 96vw;
			height: 230px;
		}

		.sfx-left {
			top: 6.6rem;
			left: -0.8rem;
		}

		.sfx-right {
			top: 7.35rem;
			right: -1.4rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.art-layer {
			animation: none !important;
		}

		.sfx-text {
			animation: none !important;
		}
	}
</style>
