import { getAccounts } from '@/actions/account';
import { getGoals } from '@/actions/goal';
import { DataTableCard } from '@/components/layout/DataTableCard';
import { CreateGoalDialog } from '@/components/goals/CreateGoalDialog';
import { GoalFilters } from '@/components/goals/GoalFilters';
import { GoalTable } from '@/components/goals/GoalTable';
import { GoalsEmpty } from '@/components/goals/GoalsEmpty';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type GoalsPageProps = {
    searchParams: Promise<{ account?: string }>;
};

export default async function GoalsPage({ searchParams }: GoalsPageProps) {
    const { account } = await searchParams;
    const [goals, accounts] = await Promise.all([getGoals({ account }), getAccounts()]);
    const hasFilters = Boolean(account);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <GoalFilters account={account} accounts={accounts} />
                <CreateGoalDialog accounts={accounts} />
            </div>

            <p className="text-sm text-muted-foreground">{goals.length === 0 ? (hasFilters ? 'No goals match your filters' : 'No goals yet') : `${goals.length} goal${goals.length === 1 ? '' : 's'}`}</p>

            {goals.length === 0 && !hasFilters ? (
                <GoalsEmpty accounts={accounts} />
            ) : goals.length === 0 && hasFilters ? (
                <Card className="max-w-lg shadow-sm">
                    <CardHeader>
                        <CardTitle>No results</CardTitle>
                        <CardDescription>Try a different account filter or add a new goal.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <DataTableCard>
                    <GoalTable goals={goals} accounts={accounts} />
                </DataTableCard>
            )}
        </div>
    );
}
