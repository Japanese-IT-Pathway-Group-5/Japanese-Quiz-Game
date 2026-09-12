// import { describe, expect, it } from 'vitest';
// import { calculateScore } from './calculateScore';

// describe('calculateScore', () => {
// 	it('gives 100 for all correct answers', () => {
// 		expect(calculateScore(10, 10, 60)).toBe(100);
// 	});

// 	it('gives 0 when all answers are wrong', () => {
// 		expect(calculateScore(0, 10, 30)).toBe(0);
// 	});

// 	it('keeps a fast wrong answer below a slow correct answer', () => {
//         const slowCorrect = calculateScore(8, 10, 120);
//         const fastWrong = calculateScore(5, 10, 1);

//         expect(slowCorrect).toBeGreaterThan(fastWrong);
//     });

// 	it('rewards accuracy before speed', () => {
// 		expect(calculateScore(8, 10, 30)).toBe(80);
// 	});

// 	it('does not give more than 100 for very fast answers', () => {
// 		expect(calculateScore(10, 10, 1)).toBe(100);
// 	});

// 	it('handles zero time without division by zero', () => {
// 		expect(calculateScore(10, 10, 0)).toBe(100);
// 	});

// 	it('returns 0 when there are no questions', () => {
// 		expect(calculateScore(0, 0, 30)).toBe(0);
// 	});
// });

import { describe, expect, it } from 'vitest';
import { calculateScore } from './calculateScore';

describe('calculateScore', () => {
    it('gives the top score when all answers are correct', () => {
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

    it('handles zero time safely', () => {
        const score = calculateScore(10, 10, 0);

        expect(score).toBe(100);
        expect(Number.isFinite(score)).toBe(true);
    });

    it('returns zero when total questions is zero', () => {
        expect(calculateScore(0, 0, 60)).toBe(0);
    });
});