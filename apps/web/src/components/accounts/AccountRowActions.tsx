'use client';

import { useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { DeleteAccountDialog } from '@/components/accounts/DeleteAccountButton';
import { EditAccountDialog } from '@/components/accounts/EditAccountDialog';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Account } from '@/types/account';
import type { Institution } from '@/types/institution';

export function AccountRowActions({ account, institutions }: { account: Account; institutions: Institution[] }) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <DeleteAccountDialog id={account.id} name={account.name}>
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
            </DeleteAccountDialog>
            <EditAccountDialog account={account} institutions={institutions} open={editOpen} onOpenChange={setEditOpen} />
        </>
    );
}
