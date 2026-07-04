'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { initialActionState, zodErrorsToFieldErrors, type ActionState } from '@/lib/action-state';
import { routes } from '@/config/routes';
import { fieldError, formDataToObject, getApiErrorMessage, getApiFieldErrors } from '@/lib/errors';
import { api } from '@/lib/api';
import { createAccountSchema } from '@/lib/schemas/account';
import type { Account, CreateAccountInput } from '@/types/account';

export async function getAccounts(): Promise<Account[]> {
    const { data } = await api.get<Account[]>('/accounts/');
    return data;
}

export async function createAccount(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const parsed = createAccountSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: CreateAccountInput = {
        institution: parsed.data.institution,
        name: parsed.data.name,
        account_type: parsed.data.account_type,
        opening_balance: parsed.data.opening_balance,
        notes: parsed.data.notes?.trim() ?? '',
    };

    try {
        await api.post('/accounts/', input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.accounts);
    redirect(routes.accounts);
}
