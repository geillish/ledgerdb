import { Progress, ProgressValue } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/format';
import { getGoalProgressPercent } from '@/lib/goal';

type GoalProgressProps = {
    currentAmount: string;
    targetAmount: string;
};

export function GoalProgress({ currentAmount, targetAmount }: GoalProgressProps) {
    const percent = getGoalProgressPercent(currentAmount, targetAmount);

    return (
        <div className="min-w-40 space-y-2">
            <Progress value={percent}>
                <ProgressValue>{() => `${percent}%`}</ProgressValue>
            </Progress>
            <p className="text-xs text-muted-foreground tabular-nums">
                {formatCurrency(currentAmount)} of {formatCurrency(targetAmount)}
            </p>
        </div>
    );
}
