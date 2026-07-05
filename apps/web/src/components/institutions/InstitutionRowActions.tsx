'use client';

import { useState } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { DeleteInstitutionDialog } from '@/components/institutions/DeleteInstitutionButton';
import { EditInstitutionDialog } from '@/components/institutions/EditInstitutionDialog';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function InstitutionRowActions({ id, name }: { id: string; name: string }) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <DeleteInstitutionDialog id={id} name={name}>
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
            </DeleteInstitutionDialog>
            <EditInstitutionDialog institution={{ id, name }} open={editOpen} onOpenChange={setEditOpen} />
        </>
    );
}
