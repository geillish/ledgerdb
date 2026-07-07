'use client';

import { useActionState, type ReactNode } from 'react';

import { deleteGoal } from '@/actions/goal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { initialActionState } from '@/lib/action-state';

type DeleteGoalDialogProps = {
    id: string;
    name: string;
    children: ReactNode;
};

export function DeleteGoalDialog({ id, name, children }: DeleteGoalDialogProps) {
    const [state, formAction, isPending] = useActionState(deleteGoal, initialActionState);

    return (
        <AlertDialog>
            {children}
            <AlertDialogContent>
                <form action={formAction}>
                    <input type="hidden" name="id" value={id} />
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete goal?</AlertDialogTitle>
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
