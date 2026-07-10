import { getAccounts } from '@/actions/account';
import { listGoals } from '@/actions/goal';
import { DataTableCard } from '@/components/layout/DataTableCard';
import { TablePagination } from '@/components/layout/TablePagination';
import { CreateGoalDialog } from '@/components/goals/CreateGoalDialog';
import { GoalFilters } from '@/components/goals/GoalFilters';
import { GoalTable } from '@/components/goals/GoalTable';
import { GoalsEmpty } from '@/components/goals/GoalsEmpty';
import { routes } from '@/config/routes';
import { formatPaginationSummary, parsePage } from '@/lib/pagination';
import { PAGE_SIZE } from '@/types/pagination';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type GoalsPageProps = {
    searchParams: Promise<{ account?: string; page?: string }>;
};

export default async function GoalsPage({ searchParams }: GoalsPageProps) {
    const { account, page: pageParam } = await searchParams;
    const page = parsePage(pageParam);
    const [goalPage, accounts] = await Promise.all([listGoals({ account, page }), getAccounts()]);
    const { results: goals, count } = goalPage;
    const hasFilters = Boolean(account);
    const summary = hasFilters ? (count === 0 ? 'No goals match your filters' : formatPaginationSummary(count, page, PAGE_SIZE, 'goal', 'goals')) : count === 0 ? 'No goals yet' : formatPaginationSummary(count, page, PAGE_SIZE, 'goal', 'goals');

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <GoalFilters account={account} accounts={accounts} />
                <CreateGoalDialog accounts={accounts} />
            </div>

            <p className="text-sm text-muted-foreground">{summary}</p>

            {count === 0 && !hasFilters ? (
                <GoalsEmpty accounts={accounts} />
            ) : count === 0 && hasFilters ? (
                <Card className="max-w-lg shadow-sm">
                    <CardHeader>
                        <CardTitle>No results</CardTitle>
                        <CardDescription>Try a different account filter or add a new goal.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <DataTableCard>
                    <GoalTable goals={goals} accounts={accounts} />
                    <TablePagination pathname={routes.goals} page={page} totalCount={count} searchParams={{ account }} />
                </DataTableCard>
            )}
        </div>
    );
}
