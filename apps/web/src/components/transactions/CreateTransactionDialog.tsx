'use client';

import { Plus } from 'lucide-react';
import { useActionState } from 'react';

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
import { TRANSACTION_CATEGORY_LABELS, TRANSACTION_CATEGORIES } from '@/types/transaction';
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
                            <DialogDescription>Record income, spending, or a transfer.</DialogDescription>
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
                                <Select id="transaction-category" name="category" required defaultValue="GROCERIES">
                                    {TRANSACTION_CATEGORIES.map(category => (
                                        <option key={category} value={category}>
                                            {TRANSACTION_CATEGORY_LABELS[category]}
                                        </option>
                                    ))}
                                </Select>
                            </Field>

                            <Field label="Amount" id="transaction-amount" error={fieldError(state.errors, 'amount')}>
                                <Input id="transaction-amount" name="amount" type="number" step="0.01" required placeholder="0.00" />
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
