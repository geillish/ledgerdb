'use client';

import { useActionState, type ReactNode } from 'react';

import { deleteAccount } from '@/actions/account';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { initialActionState } from '@/lib/action-state';

type DeleteAccountDialogProps = {
    id: string;
    name: string;
    children: ReactNode;
};

export function DeleteAccountDialog({ id, name, children }: DeleteAccountDialogProps) {
    const [state, formAction, isPending] = useActionState(deleteAccount, initialActionState);

    return (
        <AlertDialog>
            {children}
            <AlertDialogContent>
                <form action={formAction}>
                    <input type="hidden" name="id" value={id} />
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
                        <AlertDialogDescription>This cannot be undone. Deletion is blocked if transactions or goals are still linked to this account.</AlertDialogDescription>
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

export function DeleteAccountButton({ id, name }: { id: string; name: string }) {
    return (
        <DeleteAccountDialog id={id} name={name}>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>Delete</AlertDialogTrigger>
        </DeleteAccountDialog>
    );
}
