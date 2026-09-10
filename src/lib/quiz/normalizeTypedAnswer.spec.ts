import { describe, it, expect } from 'vitest';
import { normalizeTypedAnswer } from './normalizeTypedAnswer';

describe('normalizeTypedAnswer', () => {
	it('converts long vowels the same as native hiragana', () => {
		expect(normalizeTypedAnswer('tou')).toBe('とう');
		expect(normalizeTypedAnswer('とう')).toBe('とう');
	});

	it('converts small tsu (sokuon / doubled consonant) correctly', () => {
		expect(normalizeTypedAnswer('kitte')).toBe('きって');
		expect(normalizeTypedAnswer('きって')).toBe('きって');
	});

	it('treats all three ways of writing n as equivalent', () => {
		expect(normalizeTypedAnswer('nn')).toBe('ん');
		expect(normalizeTypedAnswer("n'")).toBe('ん');
		expect(normalizeTypedAnswer('ん')).toBe('ん');
	});

	it('converts n before a vowel correctly in context', () => {
		expect(normalizeTypedAnswer('konna')).toBe('こんな');
	});

	it('strips leading and trailing whitespace', () => {
		expect(normalizeTypedAnswer('  toumei  ')).toBe('とうめい');
	});

	it('treats full-width input the same as half-width', () => {
		expect(normalizeTypedAnswer('ｔｏｕｍｅｉ')).toBe('とうめい');
	});

	it('passes already-correct hiragana through unchanged', () => {
		expect(normalizeTypedAnswer('とうめい')).toBe('とうめい');
	});

	it('handles empty input without throwing', () => {
		expect(() => normalizeTypedAnswer('')).not.toThrow();
		expect(normalizeTypedAnswer('')).toBe('');
	});

	it('handles mixed romaji and hiragana input without throwing', () => {
		expect(() => normalizeTypedAnswer('とうtoumei')).not.toThrow();
	});

	it('treats full-width apostrophe-n the same as half-width', () => {
		expect(normalizeTypedAnswer("ｎ'")).toBe(normalizeTypedAnswer("n'"));
	});
});
