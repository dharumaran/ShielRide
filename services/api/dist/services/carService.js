export function computeCar(input) {
    const poolCapital = input.premiumPoolPaise + input.seedBufferPaise;
    const totalExpectedLoss = input.triggerRate * input.avgPayoutPaise * input.activeWorkers;
    const car = totalExpectedLoss > 0 ? poolCapital / totalExpectedLoss : 999;
    if (car < 1.0)
        return { car, status: 'pause_policies' };
    if (car < 1.2)
        return { car, status: 'increase_alpha' };
    if (car < 1.5)
        return { car, status: 'monitor' };
    return { car, status: 'stable' };
}
