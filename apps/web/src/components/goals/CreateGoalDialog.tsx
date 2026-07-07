'use client';

import { Plus } from 'lucide-react';
import { useActionState } from 'react';

import { createGoal } from '@/actions/goal';
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

export function CreateGoalDialog({ accounts, label = 'Add goal', className }: { accounts: Account[]; label?: string; className?: string }) {
    const [state, formAction, isPending] = useActionState(createGoal, initialActionState);
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
                            <DialogTitle>New goal</DialogTitle>
                            <DialogDescription>Set a savings target for one of your accounts.</DialogDescription>
                        </DialogHeader>
                        <form action={formAction} className="space-y-5">
                            {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                            <Field label="Account" id="goal-account" error={fieldError(state.errors, 'account')}>
                                <Select id="goal-account" name="account" required defaultValue="">
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

                            <Field label="Name" id="goal-name" error={fieldError(state.errors, 'name')}>
                                <Input id="goal-name" name="name" required maxLength={100} placeholder="Emergency fund" />
                            </Field>

                            <Field label="Target amount" id="goal-target-amount" error={fieldError(state.errors, 'target_amount')}>
                                <Input id="goal-target-amount" name="target_amount" type="number" step="0.01" min="0.01" required placeholder="0.00" />
                            </Field>

                            <Field label="Target date" id="goal-target-date" error={fieldError(state.errors, 'target_date')}>
                                <Input id="goal-target-date" name="target_date" type="date" />
                            </Field>

                            <Field label="Notes" id="goal-notes" error={fieldError(state.errors, 'notes')}>
                                <Textarea id="goal-notes" name="notes" rows={3} placeholder="Optional notes" />
                            </Field>

                            <DialogFooter>
                                <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Creating...' : 'Create goal'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>No accounts yet</DialogTitle>
                            <DialogDescription>You need at least one account before creating a savings goal.</DialogDescription>
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
