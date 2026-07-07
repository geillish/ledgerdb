export function getGoalProgressPercent(currentAmount: string, targetAmount: string): number {
    const current = parseFloat(currentAmount);
    const target = parseFloat(targetAmount);

    if (Number.isNaN(current) || Number.isNaN(target) || target <= 0) {
        return 0;
    }

    return Math.min(100, Math.round((current / target) * 100));
}
