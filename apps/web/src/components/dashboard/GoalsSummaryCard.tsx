import { GoalProgress } from '@/components/goals/GoalProgress';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/config/routes';
import type { DashboardGoalSummary } from '@/types/dashboard';

export function GoalsSummaryCard({ goals }: { goals: DashboardGoalSummary[] }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle>Savings goals</CardTitle>
                    <CardDescription>Progress based on linked account balances.</CardDescription>
                </div>
                {goals.length > 0 && (
                    <ButtonLink href={routes.goals} variant="outline" size="sm">
                        View all
                    </ButtonLink>
                )}
            </CardHeader>
            <CardContent>
                {goals.length > 0 ? (
                    <div className="space-y-6">
                        {goals.map(goal => (
                            <div key={goal.id} className="space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium">{goal.name}</p>
                                        <p className="text-xs text-muted-foreground">{goal.account_name}</p>
                                    </div>
                                </div>
                                <GoalProgress currentAmount={goal.current_amount} targetAmount={goal.target_amount} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 py-4 text-center">
                        <p className="text-sm text-muted-foreground">No savings goals yet.</p>
                        <ButtonLink href={routes.goals}>Create a goal</ButtonLink>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
