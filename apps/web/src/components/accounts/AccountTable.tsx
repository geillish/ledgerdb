import { AccountRowActions } from '@/components/accounts/AccountRowActions';
import { AccountTypeBadge } from '@/components/accounts/AccountTypeBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format';
import type { Account } from '@/types/account';
import type { Institution } from '@/types/institution';

export function AccountTable({ accounts, institutions }: { accounts: Account[]; institutions: Institution[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Current Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {accounts.map(account => (
                    <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.institution_name}</TableCell>
                        <TableCell>
                            <AccountTypeBadge type={account.account_type} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(account.current_balance)}</TableCell>
                        <TableCell className="text-right">
                            <AccountRowActions account={account} institutions={institutions} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
