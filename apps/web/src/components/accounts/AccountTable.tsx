import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatAccountType, formatCurrency } from '@/lib/format';
import type { Account } from '@/types/account';

export function AccountTable({ accounts }: { accounts: Account[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Opening Balance</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {accounts.map(account => (
                    <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.institution_name}</TableCell>
                        <TableCell>{formatAccountType(account.account_type)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(account.opening_balance)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
