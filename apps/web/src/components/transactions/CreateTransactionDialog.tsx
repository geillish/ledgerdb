'use client';

import { Plus } from 'lucide-react';
import { useActionState } from 'react';

import { TransactionCategorySelect } from '@/components/transactions/TransactionCategorySelect';
import { createTransaction } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/config/routes';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import { cn } from '@/lib/utils';
import type { Account } from '@/types/account';

export function CreateTransactionDialog({ accounts, defaultDate, label = 'Add transaction', className }: { accounts: Account[]; defaultDate: string; label?: string; className?: string }) {
    const [state, formAction, isPending] = useActionState(createTransaction, initialActionState);
    const hasAccounts = accounts.length > 0;

    return (
        <Dialog>
            <DialogTrigger render={<Button className={cn('gap-1.5', className)} />}>
                <Plus className="size-4" />
                {label}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {hasAccounts ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>New transaction</DialogTitle>
                            <DialogDescription>Enter positive amounts only. Category decides whether money is added (income) or subtracted (expense).</DialogDescription>
                        </DialogHeader>
                        <form action={formAction} className="space-y-5">
                            {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                            <Field label="Account" id="transaction-account" error={fieldError(state.errors, 'account')}>
                                <Select id="transaction-account" name="account" required defaultValue="">
                                    <option value="" disabled>
                                        Select an account
                                    </option>
                                    {accounts.map(account => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </Select>
                            </Field>

                            <Field label="Date" id="transaction-date" error={fieldError(state.errors, 'transaction_date')}>
                                <Input id="transaction-date" name="transaction_date" type="date" required defaultValue={defaultDate} />
                            </Field>

                            <Field label="Category" id="transaction-category" error={fieldError(state.errors, 'category')}>
                                <TransactionCategorySelect id="transaction-category" defaultValue="SHOPPING" />
                                <p className="text-xs text-muted-foreground">Shopping and other expenses subtract from your balance. Salary adds to it.</p>
                            </Field>

                            <Field label="Amount" id="transaction-amount" error={fieldError(state.errors, 'amount')}>
                                <Input id="transaction-amount" name="amount" type="number" step="0.01" min="0.01" required placeholder="500.00" />
                                <p className="text-xs text-muted-foreground">Always enter a positive number, e.g. 500 for a €500 shopping trip.</p>
                            </Field>

                            <Field label="Note" id="transaction-note" error={fieldError(state.errors, 'note')}>
                                <Textarea id="transaction-note" name="note" rows={3} placeholder="Optional note" />
                            </Field>

                            <DialogFooter>
                                <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Creating...' : 'Create transaction'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>No accounts yet</DialogTitle>
                            <DialogDescription>You need at least one account before recording transactions.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose render={<Button variant="outline" type="button" />}>Close</DialogClose>
                            <ButtonLink href={routes.accounts}>Go to accounts</ButtonLink>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
