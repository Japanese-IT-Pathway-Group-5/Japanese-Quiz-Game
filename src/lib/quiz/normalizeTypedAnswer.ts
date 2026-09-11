import { toHiragana } from 'wanakana';

export function normalizeTypedAnswer(input: string): string {
	const trimmed = input.trim();
	const widthFolded = trimmed.normalize('NFKC');
	const nNormalized = widthFolded.endsWith('nn') ? widthFolded.slice(0, -2) + "n'" : widthFolded;

	return toHiragana(nNormalized);
}
