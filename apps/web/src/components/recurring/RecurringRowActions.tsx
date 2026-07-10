'use client';

import { useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { DeleteRecurringDialog } from '@/components/recurring/DeleteRecurringDialog';
import { EditRecurringDialog } from '@/components/recurring/EditRecurringDialog';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/format';
import type { Account } from '@/types/account';
import type { RecurringTransaction } from '@/types/recurring-transaction';

function recurringLabel(recurring: RecurringTransaction): string {
    return `${recurring.note || recurring.category} (${formatCurrency(recurring.amount)} on day ${recurring.day_of_month})`;
}

export function RecurringRowActions({ recurring, accounts }: { recurring: RecurringTransaction; accounts: Account[] }) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <DeleteRecurringDialog id={recurring.id} name={recurringLabel(recurring)}>
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
            </DeleteRecurringDialog>
            <EditRecurringDialog recurring={recurring} accounts={accounts} open={editOpen} onOpenChange={setEditOpen} />
        </>
    );
}
