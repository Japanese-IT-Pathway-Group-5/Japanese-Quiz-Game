import { browser } from '$app/environment';

const BGM_URL = '/audio/bgm/theme.mp3';
const POSITION_KEY = 'bgm-position';
const PLAYING_KEY = 'bgm-playing';

let audio: HTMLAudioElement | null = null;

if (browser) {
	audio = new Audio(BGM_URL);
	audio.loop = true;
	audio.volume = 0.3;
	audio.preload = 'auto';

	const savedPosition = sessionStorage.getItem(POSITION_KEY);
	if (savedPosition) {
		audio.addEventListener(
			'loadedmetadata',
			() => {
				if (audio) audio.currentTime = parseFloat(savedPosition);
			},
			{ once: true }
		);
	}

	audio.addEventListener('timeupdate', () => {
		if (audio) sessionStorage.setItem(POSITION_KEY, String(audio.currentTime));
	});

	audio.load();
}

export function initBackgroundMusic() {
	if (!audio) return;
	const el = audio;
	const wasPlaying = sessionStorage.getItem(PLAYING_KEY) === 'true';

	function startOnInteraction() {
		el.play().catch(() => {});
		sessionStorage.setItem(PLAYING_KEY, 'true');
	}

	if (wasPlaying) {
		el.play()
			.then(() => sessionStorage.setItem(PLAYING_KEY, 'true'))
			.catch(() => {
				window.addEventListener('pointerdown', startOnInteraction, { once: true });
			});
	} else {
		window.addEventListener('pointerdown', startOnInteraction, { once: true });
	}

	window.addEventListener('beforeunload', () => {
		sessionStorage.setItem(POSITION_KEY, String(el.currentTime));
	});
}
