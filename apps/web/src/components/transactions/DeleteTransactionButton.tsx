'use client';

import { useActionState, type ReactNode } from 'react';

import { deleteTransaction } from '@/actions/transaction';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { initialActionState } from '@/lib/action-state';

type DeleteTransactionDialogProps = {
    id: string;
    name: string;
    children: ReactNode;
};

export function DeleteTransactionDialog({ id, name, children }: DeleteTransactionDialogProps) {
    const [state, formAction, isPending] = useActionState(deleteTransaction, initialActionState);

    return (
        <AlertDialog>
            {children}
            <AlertDialogContent>
                <form action={formAction}>
                    <input type="hidden" name="id" value={id} />
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                        <AlertDialogDescription>Delete {name}? This cannot be undone.</AlertDialogDescription>
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
