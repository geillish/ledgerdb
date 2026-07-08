import { Progress } from '@/components/ui/progress';
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
            <div className="flex items-center gap-3">
                <Progress value={percent} className="flex-1" />
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{percent}%</span>
            </div>
            <p className="text-xs text-muted-foreground tabular-nums">
                {formatCurrency(currentAmount)} of {formatCurrency(targetAmount)}
            </p>
        </div>
    );
}
