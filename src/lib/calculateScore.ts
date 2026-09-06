export function calculateScore(
    correct: number,
    total: number, 
    timeTaken: number
): number {
    if(total<=0){
        return 0;
    }

    if(correct<=0){
        return 0;
    }
    const accuracy = correct/total;

    const targetTime = 60;

    const speedBonus = 
        timeTaken<=0 ? 1 : Math.min(1, targetTime / timeTaken);
    const score = accuracy*speedBonus * 100;

    return Math.round(score);
}