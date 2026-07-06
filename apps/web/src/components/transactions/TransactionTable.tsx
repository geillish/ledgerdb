import { TransactionRowActions } from '@/components/transactions/TransactionRowActions';
import { TransactionCategoryBadge } from '@/components/transactions/TransactionCategoryBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Account } from '@/types/account';
import type { Transaction } from '@/types/transaction';

export function TransactionTable({ transactions, accounts }: { transactions: Transaction[]; accounts: Account[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                        <TableCell className="font-medium">{transaction.account_name}</TableCell>
                        <TableCell>
                            <TransactionCategoryBadge category={transaction.category} />
                        </TableCell>
                        <TableCell className="max-w-48 truncate text-muted-foreground">{transaction.note || '—'}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell className="text-right">
                            <TransactionRowActions transaction={transaction} accounts={accounts} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
