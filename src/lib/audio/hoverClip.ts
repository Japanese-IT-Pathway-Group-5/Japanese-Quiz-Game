const CLIP_URL = '/audio/team/hover.mp3';

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
	if (!audio) {
		audio = new Audio(CLIP_URL);
	}
	return audio;
}

export function replayHoverClip() {
	const el = getAudio();
	el.currentTime = 0;
	el.play().catch(() => {});
}

export function stopHoverClip() {
	if (audio) {
		audio.pause();
		audio.currentTime = 0;
	}
}
