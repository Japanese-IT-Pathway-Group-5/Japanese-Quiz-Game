import { describe, expect, it } from 'vitest';
import { calculateScore } from './calculateScore';

describe('calculateScore', () => {
	it('gives the top score when all answers are correct within target time', () => {
		expect(calculateScore(10, 10, 60)).toBe(100);
	});

	it('gives zero when all answers are wrong', () => {
		expect(calculateScore(0, 10, 60)).toBe(0);
	});

	it('keeps a fast wrong answer below a slow correct answer', () => {
		const slowCorrect = calculateScore(8, 10, 120);
		const fastWrong = calculateScore(5, 10, 1);

		expect(slowCorrect).toBeGreaterThan(fastWrong);
	});

	it('caps the speed bonus', () => {
		const veryFast = calculateScore(8, 10, 0);
		const targetSpeed = calculateScore(8, 10, 60);

		expect(veryFast).toBe(targetSpeed);
	});

	it('handles zero time safely without division by zero', () => {
		const score = calculateScore(10, 10, 0);

		expect(score).toBe(100);
		expect(Number.isFinite(score)).toBe(true);
	});

	it('returns zero when total questions is zero', () => {
		expect(calculateScore(0, 0, 60)).toBe(0);
	});
});
