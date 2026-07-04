import type { ZodError } from 'zod';

import type { FieldErrors } from '@/lib/errors';

export type ActionState = {
    errors?: FieldErrors;
    message?: string;
};

export const initialActionState: ActionState = {};

export function zodErrorsToFieldErrors(error: ZodError): FieldErrors {
    const errors: FieldErrors = {};

    for (const issue of error.issues) {
        const key = issue.path[0]?.toString() ?? '_form';

        if (!errors[key]) {
            errors[key] = [];
        }

        errors[key].push(issue.message);
    }

    return errors;
}
