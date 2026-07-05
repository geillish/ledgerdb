'use client';

import type { FormEvent } from 'react';
import { useActionState } from 'react';

import { deleteInstitution } from '@/actions/institution';
import { Button } from '@/components/ui/button';
import { initialActionState } from '@/lib/action-state';

export function DeleteInstitutionButton({ id, name }: { id: string; name: string }) {
    const [state, formAction, isPending] = useActionState(deleteInstitution, initialActionState);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        if (!confirm(`Delete ${name}? This cannot be undone.`)) {
            event.preventDefault();
        }
    };

    return (
        <form action={formAction} onSubmit={handleSubmit} className="inline">
            <input type="hidden" name="id" value={id} />
            <Button type="submit" variant="destructive" size="sm" disabled={isPending}>
                {isPending ? 'Deleting...' : 'Delete'}
            </Button>
            {state.message && <p className="mt-1 text-sm text-destructive">{state.message}</p>}
        </form>
    );
}
