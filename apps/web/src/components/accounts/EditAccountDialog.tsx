'use client';

import { useActionState } from 'react';

import { updateAccount } from '@/actions/account';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPES, type Account } from '@/types/account';
import type { Institution } from '@/types/institution';

type EditAccountDialogProps = {
    account: Account;
    institutions: Institution[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditAccountDialog({ account, institutions, open, onOpenChange }: EditAccountDialogProps) {
    const [state, formAction, isPending] = useActionState(updateAccount, initialActionState);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit account</DialogTitle>
                    <DialogDescription>Update account details.</DialogDescription>
                </DialogHeader>
                <form key={account.id} action={formAction} className="space-y-4">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    <input type="hidden" name="id" value={account.id} />

                    <Field label="Institution" id={`account-institution-${account.id}`} error={fieldError(state.errors, 'institution')}>
                        <Select id={`account-institution-${account.id}`} name="institution" required defaultValue={account.institution}>
                            {institutions.map(institution => (
                                <option key={institution.id} value={institution.id}>
                                    {institution.name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Name" id={`account-name-${account.id}`} error={fieldError(state.errors, 'name')}>
                        <Input id={`account-name-${account.id}`} name="name" type="text" required maxLength={100} placeholder="e.g. Main Current Account" defaultValue={account.name} />
                    </Field>

                    <Field label="Type" id={`account-type-${account.id}`} error={fieldError(state.errors, 'account_type')}>
                        <Select id={`account-type-${account.id}`} name="account_type" required defaultValue={account.account_type}>
                            {ACCOUNT_TYPES.map(type => (
                                <option key={type} value={type}>
                                    {ACCOUNT_TYPE_LABELS[type]}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Notes" id={`account-notes-${account.id}`} error={fieldError(state.errors, 'notes')}>
                        <Textarea id={`account-notes-${account.id}`} name="notes" rows={3} placeholder="Optional notes" defaultValue={account.notes} />
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
