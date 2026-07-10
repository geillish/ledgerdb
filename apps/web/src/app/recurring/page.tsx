import { getAccounts } from '@/actions/account';
import { listRecurringTransactions } from '@/actions/recurring-transaction';
import { CreateRecurringDialog } from '@/components/recurring/CreateRecurringDialog';
import { RecurringFilters } from '@/components/recurring/RecurringFilters';
import { RecurringTable } from '@/components/recurring/RecurringTable';
import { DataTableCard } from '@/components/layout/DataTableCard';
import { TablePagination } from '@/components/layout/TablePagination';
import { routes } from '@/config/routes';
import { formatPaginationSummary, parsePage } from '@/lib/pagination';
import { PAGE_SIZE } from '@/types/pagination';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type RecurringPageProps = {
    searchParams: Promise<{ account?: string; page?: string }>;
};

export default async function RecurringPage({ searchParams }: RecurringPageProps) {
    const { account, page: pageParam } = await searchParams;
    const page = parsePage(pageParam);
    const [recurringPage, accounts] = await Promise.all([listRecurringTransactions({ account, page }), getAccounts()]);
    const { results: recurringTransactions, count } = recurringPage;
    const hasFilters = Boolean(account);
    const summary = hasFilters
        ? count === 0
            ? 'No recurring payments match your filters'
            : formatPaginationSummary(count, page, PAGE_SIZE, 'recurring payment', 'recurring payments')
        : count === 0
          ? 'No recurring payments yet'
          : formatPaginationSummary(count, page, PAGE_SIZE, 'recurring payment', 'recurring payments');

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <RecurringFilters account={account} accounts={accounts} />
                <CreateRecurringDialog accounts={accounts} />
            </div>

            <p className="text-sm text-muted-foreground">{summary}</p>

            {count === 0 ? (
                <Card className="max-w-lg shadow-sm">
                    <CardHeader>
                        <CardTitle>{hasFilters ? 'No results' : 'No recurring payments yet'}</CardTitle>
                        <CardDescription>{hasFilters ? 'Try a different account filter or add a new recurring payment.' : 'Add salary, rent, subscriptions, and savings transfers to power spendable money on the dashboard.'}</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <DataTableCard>
                    <RecurringTable recurringTransactions={recurringTransactions} accounts={accounts} />
                    <TablePagination pathname={routes.recurring} page={page} totalCount={count} searchParams={{ account }} />
                </DataTableCard>
            )}
        </div>
    );
}
