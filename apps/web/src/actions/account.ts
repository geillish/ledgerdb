'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { initialActionState, zodErrorsToFieldErrors, type ActionState } from '@/lib/action-state';
import { routes } from '@/config/routes';
import { formDataToObject, getApiErrorMessage, getApiFieldErrors } from '@/lib/errors';
import { api } from '@/lib/api';
import { createAccountSchema, updateAccountSchema } from '@/lib/schemas/account';
import type { Account, CreateAccountInput, UpdateAccountInput } from '@/types/account';
import { DROPDOWN_PAGE_SIZE, type PaginatedResponse } from '@/types/pagination';

export async function listAccounts(page = 1): Promise<PaginatedResponse<Account>> {
    const { data } = await api.get<PaginatedResponse<Account>>('/accounts/', {
        params: { page },
    });

    return data;
}

export async function getAccounts(): Promise<Account[]> {
    const { data } = await api.get<PaginatedResponse<Account>>('/accounts/', {
        params: { page_size: DROPDOWN_PAGE_SIZE },
    });

    return data.results;
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
        current_balance: parsed.data.current_balance,
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
    revalidatePath(routes.home);
    redirect(routes.accounts);
}

export async function updateAccount(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const values = formDataToObject(formData);
    const id = values.id;
    const parsed = updateAccountSchema.safeParse(values);

    if (typeof id !== 'string') {
        return { message: 'Invalid account.' };
    }

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: UpdateAccountInput = {
        institution: parsed.data.institution,
        name: parsed.data.name,
        account_type: parsed.data.account_type,
        notes: parsed.data.notes?.trim() ?? '',
        include_in_spendable: parsed.data.include_in_spendable,
    };

    try {
        await api.patch(`/accounts/${id}/`, input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.accounts);
    revalidatePath(routes.home);
    redirect(routes.accounts);
}

export async function deleteAccount(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id');

    if (typeof id !== 'string') {
        return { message: 'Invalid account.' };
    }

    try {
        await api.delete(`/accounts/${id}/`);
    } catch (error) {
        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.accounts);
    revalidatePath(routes.home);
    redirect(routes.accounts);
}
