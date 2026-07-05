'use client';

import { useActionState } from 'react';

import { updateInstitution } from '@/actions/institution';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { routes } from '@/config/routes';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import type { Institution } from '@/types/institution';

export function InstitutionForm({ institution }: { institution: Institution }) {
    const [state, formAction, isPending] = useActionState(updateInstitution, initialActionState);

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Edit institution</CardTitle>
                <CardDescription>Update the institution name.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    <input type="hidden" name="id" value={institution.id} />

                    <Field label="Name" id="name" error={fieldError(state.errors, 'name')}>
                        <Input id="name" name="name" type="text" required maxLength={100} placeholder="e.g. Barclays" defaultValue={institution.name} />
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save changes'}
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
