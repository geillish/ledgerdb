'use client';

import { useActionState } from 'react';

import { createAccount } from '@/actions/account';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/config/routes';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPES } from '@/types/account';
import type { Institution } from '@/types/institution';

export function AccountForm({ institutions }: { institutions: Institution[] }) {
    const [state, formAction, isPending] = useActionState(createAccount, initialActionState);

    if (institutions.length === 0) {
        return (
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>No institutions yet</CardTitle>
                    <CardDescription>You need at least one institution before creating an account.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3">
                    <ButtonLink href={routes.institutionsNew}>Add institution</ButtonLink>
                    <ButtonLink variant="outline" href={routes.accounts}>
                        Back to accounts
                    </ButtonLink>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>New account</CardTitle>
                <CardDescription>Add a financial account linked to an institution.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    <Field label="Institution" id="institution" error={fieldError(state.errors, 'institution')}>
                        <Select id="institution" name="institution" required defaultValue="">
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

                    <Field label="Name" id="name" error={fieldError(state.errors, 'name')}>
                        <Input id="name" name="name" type="text" required maxLength={100} placeholder="e.g. Main Current Account" />
                    </Field>

                    <Field label="Type" id="account_type" error={fieldError(state.errors, 'account_type')}>
                        <Select id="account_type" name="account_type" required defaultValue="CURRENT">
                            {ACCOUNT_TYPES.map(type => (
                                <option key={type} value={type}>
                                    {ACCOUNT_TYPE_LABELS[type]}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Opening balance" id="opening_balance" error={fieldError(state.errors, 'opening_balance')}>
                        <Input id="opening_balance" name="opening_balance" type="number" step="0.01" required defaultValue="0.00" />
                    </Field>

                    <Field label="Notes" id="notes" error={fieldError(state.errors, 'notes')}>
                        <Textarea id="notes" name="notes" rows={3} placeholder="Optional notes" />
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create account'}
                        </Button>
                        <ButtonLink variant="outline" href={routes.accounts}>
                            Cancel
                        </ButtonLink>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
