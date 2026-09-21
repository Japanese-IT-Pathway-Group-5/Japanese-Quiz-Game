import { browser } from '$app/environment';

const CLICK_URL = '/audio/sfx/click.mp3';

let audio: HTMLAudioElement | null = null;

if (browser) {
	audio = new Audio(CLICK_URL);
	audio.preload = 'auto';
	audio.volume = 0.5;
	audio.load();
}

export function playClickSound() {
	if (!audio) return;
	audio.currentTime = 0;
	audio.play().catch(() => {});
}
