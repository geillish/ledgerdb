'use client';

import { useActionState } from 'react';

import { updateInstitution } from '@/actions/institution';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import type { Institution } from '@/types/institution';

type EditInstitutionDialogProps = {
    institution: Pick<Institution, 'id' | 'name'>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditInstitutionDialog({ institution, open, onOpenChange }: EditInstitutionDialogProps) {
    const [state, formAction, isPending] = useActionState(updateInstitution, initialActionState);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit institution</DialogTitle>
                    <DialogDescription>Update the institution name.</DialogDescription>
                </DialogHeader>
                <form key={institution.id} action={formAction} className="space-y-4">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    <input type="hidden" name="id" value={institution.id} />

                    <Field label="Name" id={`institution-name-${institution.id}`} error={fieldError(state.errors, 'name')}>
                        <Input id={`institution-name-${institution.id}`} name="name" type="text" required maxLength={100} placeholder="e.g. Barclays" defaultValue={institution.name} />
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
