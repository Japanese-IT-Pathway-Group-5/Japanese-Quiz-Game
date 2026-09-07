import { toHiragana } from 'wanakana';

export function normalizeTypedAnswer(input: string): string {
	const trimmed = input.trim();
	const widthFolded = trimmed.normalize('NFKC');
	return toHiragana(widthFolded);
}
