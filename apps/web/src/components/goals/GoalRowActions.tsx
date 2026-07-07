'use client';

import { useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { DeleteGoalDialog } from '@/components/goals/DeleteGoalDialog';
import { EditGoalDialog } from '@/components/goals/EditGoalDialog';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Account } from '@/types/account';
import type { Goal } from '@/types/goal';

export function GoalRowActions({ goal, accounts }: { goal: Goal; accounts: Account[] }) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <DeleteGoalDialog id={goal.id} name={goal.name}>
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
            </DeleteGoalDialog>
            <EditGoalDialog goal={goal} accounts={accounts} open={editOpen} onOpenChange={setEditOpen} />
        </>
    );
}
