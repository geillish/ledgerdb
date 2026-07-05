'use client';

import { Plus } from 'lucide-react';
import { useActionState } from 'react';

import { createAccount } from '@/actions/account';
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
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPES } from '@/types/account';
import type { Institution } from '@/types/institution';

export function CreateAccountDialog({ institutions, label = 'Add account', className }: { institutions: Institution[]; label?: string; className?: string }) {
    const [state, formAction, isPending] = useActionState(createAccount, initialActionState);
    const hasInstitutions = institutions.length > 0;

    return (
        <Dialog>
            <DialogTrigger render={<Button className={cn('gap-1.5', className)} />}>
                <Plus className="size-4" />
                {label}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {hasInstitutions ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>New account</DialogTitle>
                            <DialogDescription>Add a financial account linked to an institution.</DialogDescription>
                        </DialogHeader>
                        <form action={formAction} className="space-y-4">
                            {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                            <Field label="Institution" id="account-institution" error={fieldError(state.errors, 'institution')}>
                                <Select id="account-institution" name="institution" required defaultValue="">
                                    <option value="" disabled>
                                        Select an institution
                                    </option>
                                    {institutions.map(institution => (
                                        <option key={institution.id} value={institution.id}>
                                            {institution.name}
                                        </option>
                                    ))}
                                </Select>
                            </Field>

                            <Field label="Name" id="account-name" error={fieldError(state.errors, 'name')}>
                                <Input id="account-name" name="name" type="text" required maxLength={100} placeholder="e.g. Main Current Account" />
                            </Field>

                            <Field label="Type" id="account-type" error={fieldError(state.errors, 'account_type')}>
                                <Select id="account-type" name="account_type" required defaultValue="CURRENT">
                                    {ACCOUNT_TYPES.map(type => (
                                        <option key={type} value={type}>
                                            {ACCOUNT_TYPE_LABELS[type]}
                                        </option>
                                    ))}
                                </Select>
                            </Field>

                            <Field label="Current balance" id="account-current-balance" error={fieldError(state.errors, 'current_balance')}>
                                <Input id="account-current-balance" name="current_balance" type="number" step="0.01" required defaultValue="0.00" />
                            </Field>

                            <Field label="Notes" id="account-notes" error={fieldError(state.errors, 'notes')}>
                                <Textarea id="account-notes" name="notes" rows={3} placeholder="Optional notes" />
                            </Field>

                            <DialogFooter>
                                <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Creating...' : 'Create account'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>No institutions yet</DialogTitle>
                            <DialogDescription>You need at least one institution before creating an account.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose render={<Button variant="outline" type="button" />}>Close</DialogClose>
                            <ButtonLink href={routes.institutions}>Go to institutions</ButtonLink>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
