'use client';

import { useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionButton';
import { EditTransactionDialog } from '@/components/transactions/EditTransactionDialog';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Account } from '@/types/account';
import type { Transaction } from '@/types/transaction';

function transactionLabel(transaction: Transaction): string {
    return `${formatCurrency(transaction.amount)} on ${formatDate(transaction.transaction_date)}`;
}

export function TransactionRowActions({ transaction, accounts }: { transaction: Transaction; accounts: Account[] }) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <DeleteTransactionDialog id={transaction.id} name={transactionLabel(transaction)}>
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger nativeButton={false} render={<DropdownMenuItem variant="destructive" />}>
                            Delete
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
            </DeleteTransactionDialog>
            <EditTransactionDialog transaction={transaction} accounts={accounts} open={editOpen} onOpenChange={setEditOpen} />
        </>
    );
}
