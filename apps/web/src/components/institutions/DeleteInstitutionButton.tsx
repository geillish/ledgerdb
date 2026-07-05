'use client';

import { useActionState, type ReactNode } from 'react';

import { deleteInstitution } from '@/actions/institution';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { initialActionState } from '@/lib/action-state';

type DeleteInstitutionDialogProps = {
    id: string;
    name: string;
    children: ReactNode;
};

export function DeleteInstitutionDialog({ id, name, children }: DeleteInstitutionDialogProps) {
    const [state, formAction, isPending] = useActionState(deleteInstitution, initialActionState);

    return (
        <AlertDialog>
            {children}
            <AlertDialogContent>
                <form action={formAction}>
                    <input type="hidden" name="id" value={id} />
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
                        <AlertDialogDescription>This cannot be undone. Deletion is blocked if accounts are still linked to this institution.</AlertDialogDescription>
                    </AlertDialogHeader>
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}
                    <AlertDialogFooter>
                        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit" variant="destructive" disabled={isPending}>
                            {isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function DeleteInstitutionButton({ id, name }: { id: string; name: string }) {
    return (
        <DeleteInstitutionDialog id={id} name={name}>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>Delete</AlertDialogTrigger>
        </DeleteInstitutionDialog>
    );
}
