'use client';

import { Plus } from 'lucide-react';
import { useActionState } from 'react';

import { createRecurringTransaction } from '@/actions/recurring-transaction';
import { TransactionCategorySelect } from '@/components/transactions/TransactionCategorySelect';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { routes } from '@/config/routes';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import type { Account } from '@/types/account';

export function CreateRecurringDialog({ accounts }: { accounts: Account[] }) {
    const [state, formAction, isPending] = useActionState(createRecurringTransaction, initialActionState);
    const hasAccounts = accounts.length > 0;

    return (
        <Dialog>
            <DialogTrigger render={<Button className="gap-1.5" />}>
                <Plus className="size-4" />
                Add recurring
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {hasAccounts ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>New recurring payment</DialogTitle>
                            <DialogDescription>Set up monthly income or bills. These feed into spendable money on the dashboard.</DialogDescription>
                        </DialogHeader>
                        <form action={formAction} className="space-y-5">
                            {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                            <Field label="Account" id="recurring-account" error={fieldError(state.errors, 'account')}>
                                <Select id="recurring-account" name="account" required defaultValue="">
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

                            <Field label="Category" id="recurring-category" error={fieldError(state.errors, 'category')}>
                                <TransactionCategorySelect id="recurring-category" defaultValue="BILLS" />
                            </Field>

                            <Field label="Amount" id="recurring-amount" error={fieldError(state.errors, 'amount')}>
                                <Input id="recurring-amount" name="amount" type="number" step="0.01" min="0.01" required placeholder="1250.00" />
                            </Field>

                            <Field label="Day of month" id="recurring-day" error={fieldError(state.errors, 'day_of_month')}>
                                <Input id="recurring-day" name="day_of_month" type="number" min="1" max="28" required defaultValue="1" />
                                <p className="text-xs text-muted-foreground">Use 1–28 so every month is covered.</p>
                            </Field>

                            <Field label="Note" id="recurring-note" error={fieldError(state.errors, 'note')}>
                                <Input id="recurring-note" name="note" type="text" placeholder="e.g. Rent" />
                            </Field>

                            <Field label="Status" id="recurring-active">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="hidden" name="is_active" value="false" />
                                    <input id="recurring-active" type="checkbox" name="is_active" value="true" defaultChecked />
                                    Active
                                </label>
                            </Field>

                            <DialogFooter>
                                <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Creating...' : 'Create recurring'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>No accounts yet</DialogTitle>
                            <DialogDescription>You need at least one account before adding recurring payments.</DialogDescription>
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
