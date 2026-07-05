'use client';

import { Plus } from 'lucide-react';
import { useActionState } from 'react';

import { createInstitution } from '@/actions/institution';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { initialActionState } from '@/lib/action-state';
import { fieldError } from '@/lib/errors';
import { cn } from '@/lib/utils';

export function CreateInstitutionDialog({ label = 'Add institution', className }: { label?: string; className?: string }) {
    const [state, formAction, isPending] = useActionState(createInstitution, initialActionState);

    return (
        <Dialog>
            <DialogTrigger render={<Button className={cn('gap-1.5', className)} />}>
                <Plus className="size-4" />
                {label}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New institution</DialogTitle>
                    <DialogDescription>Add a bank or financial institution.</DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    {state.message && <p className="text-sm text-destructive">{state.message}</p>}

                    <Field label="Name" id="institution-name" error={fieldError(state.errors, 'name')}>
                        <Input id="institution-name" name="name" type="text" required maxLength={100} placeholder="e.g. Barclays" />
                    </Field>

                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" type="button" />}>Cancel</DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creating...' : 'Create institution'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
