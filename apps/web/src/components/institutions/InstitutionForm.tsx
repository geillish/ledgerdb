'use client';

import { useActionState } from 'react';

import { createInstitution, updateInstitution } from '@/actions/institution';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { routes } from '@/config/routes';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import type { Institution } from '@/types/institution';

type InstitutionFormProps = {
    institution?: Institution;
};

export function InstitutionForm({ institution }: InstitutionFormProps) {
    const isEditing = Boolean(institution);
    const action = isEditing ? updateInstitution : createInstitution;
    const [state, formAction, isPending] = useActionState(action, initialActionState);

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit institution' : 'New institution'}</CardTitle>
                <CardDescription>{isEditing ? 'Update the institution name.' : 'Add a bank or financial institution.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    {isEditing && <input type="hidden" name="id" value={institution?.id} />}

                    <Field label="Name" id="name" error={fieldError(state.errors, 'name')}>
                        <Input id="name" name="name" type="text" required maxLength={100} placeholder="e.g. Barclays" defaultValue={institution?.name ?? ''} />
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create institution'}
                        </Button>
                        <ButtonLink variant="outline" href={routes.institutions}>
                            Cancel
                        </ButtonLink>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
