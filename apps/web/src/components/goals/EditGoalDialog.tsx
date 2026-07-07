'use client';

import { useActionState } from 'react';

import { updateGoal } from '@/actions/goal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import type { Account } from '@/types/account';
import type { Goal } from '@/types/goal';

type EditGoalDialogProps = {
    goal: Goal;
    accounts: Account[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditGoalDialog({ goal, accounts, open, onOpenChange }: EditGoalDialogProps) {
    const [state, formAction, isPending] = useActionState(updateGoal, initialActionState);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit goal</DialogTitle>
                    <DialogDescription>Update your savings target and details.</DialogDescription>
                </DialogHeader>
                <form key={goal.id} action={formAction} className="space-y-5">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    <input type="hidden" name="id" value={goal.id} />

                    <Field label="Account" id={`goal-account-${goal.id}`} error={fieldError(state.errors, 'account')}>
                        <Select id={`goal-account-${goal.id}`} name="account" required defaultValue={goal.account}>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Name" id={`goal-name-${goal.id}`} error={fieldError(state.errors, 'name')}>
                        <Input id={`goal-name-${goal.id}`} name="name" required maxLength={100} defaultValue={goal.name} />
                    </Field>

                    <Field label="Target amount" id={`goal-target-amount-${goal.id}`} error={fieldError(state.errors, 'target_amount')}>
                        <Input id={`goal-target-amount-${goal.id}`} name="target_amount" type="number" step="0.01" min="0.01" required defaultValue={goal.target_amount} />
                    </Field>

                    <Field label="Target date" id={`goal-target-date-${goal.id}`} error={fieldError(state.errors, 'target_date')}>
                        <Input id={`goal-target-date-${goal.id}`} name="target_date" type="date" defaultValue={goal.target_date ?? ''} />
                    </Field>

                    <Field label="Notes" id={`goal-notes-${goal.id}`} error={fieldError(state.errors, 'notes')}>
                        <Textarea id={`goal-notes-${goal.id}`} name="notes" rows={3} placeholder="Optional notes" defaultValue={goal.notes} />
                    </Field>

                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
