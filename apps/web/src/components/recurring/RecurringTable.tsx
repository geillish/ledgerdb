import { RecurringRowActions } from '@/components/recurring/RecurringRowActions';
import { TransactionCategoryBadge } from '@/components/transactions/TransactionCategoryBadge';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format';
import type { Account } from '@/types/account';
import type { RecurringTransaction } from '@/types/recurring-transaction';

export function RecurringTable({ recurringTransactions, accounts }: { recurringTransactions: RecurringTransaction[]; accounts: Account[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recurringTransactions.map(recurring => (
                    <TableRow key={recurring.id}>
                        <TableCell className="font-medium">Day {recurring.day_of_month}</TableCell>
                        <TableCell>{recurring.account_name}</TableCell>
                        <TableCell>
                            <TransactionCategoryBadge category={recurring.category} />
                        </TableCell>
                        <TableCell className="max-w-48 truncate text-muted-foreground">{recurring.note || '—'}</TableCell>
                        <TableCell>
                            <Badge variant={recurring.is_active ? 'success' : 'muted'} className="font-normal">
                                {recurring.is_active ? 'Active' : 'Paused'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{formatCurrency(recurring.amount)}</TableCell>
                        <TableCell className="text-right">
                            <RecurringRowActions recurring={recurring} accounts={accounts} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
