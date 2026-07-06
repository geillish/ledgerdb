import { getAccounts } from '@/actions/account';
import { getTransactions } from '@/actions/transaction';
import { DataTableCard } from '@/components/layout/DataTableCard';
import { CreateTransactionDialog } from '@/components/transactions/CreateTransactionDialog';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionsEmpty } from '@/components/transactions/TransactionsEmpty';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type TransactionsPageProps = {
    searchParams: Promise<{ account?: string; category?: string }>;
};

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
    const { account, category } = await searchParams;
    const [transactions, accounts] = await Promise.all([getTransactions({ account, category }), getAccounts()]);
    const hasFilters = Boolean(account || category);
    const defaultDate = new Date().toISOString().slice(0, 10);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TransactionFilters account={account} category={category} accounts={accounts} />
                <CreateTransactionDialog accounts={accounts} defaultDate={defaultDate} />
            </div>

            <p className="text-sm text-muted-foreground">{transactions.length === 0 ? (hasFilters ? 'No transactions match your filters' : 'No transactions yet') : `${transactions.length} transaction${transactions.length === 1 ? '' : 's'}`}</p>

            {transactions.length === 0 && !hasFilters ? (
                <TransactionsEmpty accounts={accounts} defaultDate={defaultDate} />
            ) : transactions.length === 0 && hasFilters ? (
                <Card className="max-w-lg shadow-sm">
                    <CardHeader>
                        <CardTitle>No results</CardTitle>
                        <CardDescription>Try different filters or add a new transaction.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <DataTableCard>
                    <TransactionTable transactions={transactions} accounts={accounts} />
                </DataTableCard>
            )}
        </div>
    );
}
