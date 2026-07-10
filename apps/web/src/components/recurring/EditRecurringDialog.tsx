'use client';

import { useActionState } from 'react';

import { updateRecurringTransaction } from '@/actions/recurring-transaction';
import { TransactionCategorySelect } from '@/components/transactions/TransactionCategorySelect';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import type { Account } from '@/types/account';
import type { RecurringTransaction } from '@/types/recurring-transaction';

type EditRecurringDialogProps = {
    recurring: RecurringTransaction;
    accounts: Account[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditRecurringDialog({ recurring, accounts, open, onOpenChange }: EditRecurringDialogProps) {
    const [state, formAction, isPending] = useActionState(updateRecurringTransaction, initialActionState);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit recurring payment</DialogTitle>
                    <DialogDescription>Update monthly income, bills, or transfers.</DialogDescription>
                </DialogHeader>
                <form key={recurring.id} action={formAction} className="space-y-5">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    <input type="hidden" name="id" value={recurring.id} />

                    <Field label="Account" id={`recurring-account-${recurring.id}`} error={fieldError(state.errors, 'account')}>
                        <Select id={`recurring-account-${recurring.id}`} name="account" required defaultValue={recurring.account}>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Category" id={`recurring-category-${recurring.id}`} error={fieldError(state.errors, 'category')}>
                        <TransactionCategorySelect id={`recurring-category-${recurring.id}`} defaultValue={recurring.category} />
                    </Field>

                    <Field label="Amount" id={`recurring-amount-${recurring.id}`} error={fieldError(state.errors, 'amount')}>
                        <Input id={`recurring-amount-${recurring.id}`} name="amount" type="number" step="0.01" min="0.01" required defaultValue={recurring.amount} />
                    </Field>

                    <Field label="Day of month" id={`recurring-day-${recurring.id}`} error={fieldError(state.errors, 'day_of_month')}>
                        <Input id={`recurring-day-${recurring.id}`} name="day_of_month" type="number" min="1" max="28" required defaultValue={recurring.day_of_month} />
                    </Field>

                    <Field label="Note" id={`recurring-note-${recurring.id}`} error={fieldError(state.errors, 'note')}>
                        <Input id={`recurring-note-${recurring.id}`} name="note" type="text" defaultValue={recurring.note} />
                    </Field>

                    <Field label="Status" id={`recurring-active-${recurring.id}`}>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="hidden" name="is_active" value="false" />
                            <input
                                id={`recurring-active-${recurring.id}`}
                                type="checkbox"
                                name="is_active"
                                value="true"
                                defaultChecked={recurring.is_active}
                            />
                            Active
                        </label>
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
