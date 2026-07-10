import { getAccounts } from '@/actions/account';
import { listTransactions } from '@/actions/transaction';
import { DataTableCard } from '@/components/layout/DataTableCard';
import { TablePagination } from '@/components/layout/TablePagination';
import { CreateTransactionDialog } from '@/components/transactions/CreateTransactionDialog';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionsEmpty } from '@/components/transactions/TransactionsEmpty';
import { routes } from '@/config/routes';
import { formatPaginationSummary, parsePage } from '@/lib/pagination';
import { PAGE_SIZE } from '@/types/pagination';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TransactionsPageProps = {
    searchParams: Promise<{ account?: string; category?: string; page?: string }>;
};

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
    const { account, category, page: pageParam } = await searchParams;
    const page = parsePage(pageParam);
    const [transactionPage, accounts] = await Promise.all([listTransactions({ account, category, page }), getAccounts()]);
    const { results: transactions, count } = transactionPage;
    const hasFilters = Boolean(account || category);
    const defaultDate = new Date().toISOString().slice(0, 10);
    const summary = hasFilters ? (count === 0 ? 'No transactions match your filters' : formatPaginationSummary(count, page, PAGE_SIZE, 'transaction', 'transactions')) : count === 0 ? 'No transactions yet' : formatPaginationSummary(count, page, PAGE_SIZE, 'transaction', 'transactions');

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TransactionFilters account={account} category={category} accounts={accounts} />
                <CreateTransactionDialog accounts={accounts} defaultDate={defaultDate} />
            </div>

            <p className="text-sm text-muted-foreground">{summary}</p>

            {count === 0 && !hasFilters ? (
                <TransactionsEmpty accounts={accounts} defaultDate={defaultDate} />
            ) : count === 0 && hasFilters ? (
                <Card className="max-w-lg shadow-sm">
                    <CardHeader>
                        <CardTitle>No results</CardTitle>
                        <CardDescription>Try different filters or add a new transaction.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <DataTableCard>
                    <TransactionTable transactions={transactions} accounts={accounts} />
                    <TablePagination pathname={routes.transactions} page={page} totalCount={count} searchParams={{ account, category }} />
                </DataTableCard>
            )}
        </div>
    );
}
