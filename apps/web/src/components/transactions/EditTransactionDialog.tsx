'use client';

import { useActionState } from 'react';

import { TransactionCategorySelect } from '@/components/transactions/TransactionCategorySelect';
import { updateTransaction } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import { getTransactionDirectionLabel } from '@/lib/transaction';
import type { Transaction } from '@/types/transaction';
import type { Account } from '@/types/account';

type EditTransactionDialogProps = {
    transaction: Transaction;
    accounts: Account[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditTransactionDialog({ transaction, accounts, open, onOpenChange }: EditTransactionDialogProps) {
    const [state, formAction, isPending] = useActionState(updateTransaction, initialActionState);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit transaction</DialogTitle>
                    <DialogDescription>Enter positive amounts only. Category decides whether money is added or subtracted.</DialogDescription>
                </DialogHeader>
                <form key={transaction.id} action={formAction} className="space-y-5">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    <input type="hidden" name="id" value={transaction.id} />

                    <Field label="Account" id={`transaction-account-${transaction.id}`} error={fieldError(state.errors, 'account')}>
                        <Select id={`transaction-account-${transaction.id}`} name="account" required defaultValue={transaction.account}>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Date" id={`transaction-date-${transaction.id}`} error={fieldError(state.errors, 'transaction_date')}>
                        <Input id={`transaction-date-${transaction.id}`} name="transaction_date" type="date" required defaultValue={transaction.transaction_date} />
                    </Field>

                    <Field label="Category" id={`transaction-category-${transaction.id}`} error={fieldError(state.errors, 'category')}>
                        <TransactionCategorySelect id={`transaction-category-${transaction.id}`} defaultValue={transaction.category} />
                        <p className="text-xs text-muted-foreground">{getTransactionDirectionLabel(transaction.category)}</p>
                    </Field>

                    <Field label="Amount" id={`transaction-amount-${transaction.id}`} error={fieldError(state.errors, 'amount')}>
                        <Input id={`transaction-amount-${transaction.id}`} name="amount" type="number" step="0.01" min="0.01" required defaultValue={transaction.amount} />
                    </Field>

                    <Field label="Note" id={`transaction-note-${transaction.id}`} error={fieldError(state.errors, 'note')}>
                        <Textarea id={`transaction-note-${transaction.id}`} name="note" rows={3} placeholder="Optional note" defaultValue={transaction.note} />
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
