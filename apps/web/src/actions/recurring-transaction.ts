'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { initialActionState, zodErrorsToFieldErrors, type ActionState } from '@/lib/action-state';
import { routes } from '@/config/routes';
import { formDataToObject, getApiErrorMessage, getApiFieldErrors } from '@/lib/errors';
import { api } from '@/lib/api';
import { createRecurringTransactionSchema, updateRecurringTransactionSchema } from '@/lib/schemas/recurring-transaction';
import { DROPDOWN_PAGE_SIZE, type PaginatedResponse } from '@/types/pagination';
import type { CreateRecurringTransactionInput, RecurringTransaction, RecurringTransactionFilters, UpdateRecurringTransactionInput } from '@/types/recurring-transaction';

export async function listRecurringTransactions(filters?: RecurringTransactionFilters): Promise<PaginatedResponse<RecurringTransaction>> {
    const params: Record<string, string | number> = {};

    if (filters?.account) {
        params.account = filters.account;
    }

    if (filters?.page) {
        params.page = filters.page;
    }

    const { data } = await api.get<PaginatedResponse<RecurringTransaction>>('/recurring-transactions/', {
        params: Object.keys(params).length > 0 ? params : undefined,
    });

    return data;
}

export async function getRecurringTransactions(filters?: Omit<RecurringTransactionFilters, 'page'>): Promise<RecurringTransaction[]> {
    const params: Record<string, string | number> = {
        page_size: DROPDOWN_PAGE_SIZE,
    };

    if (filters?.account) {
        params.account = filters.account;
    }

    const { data } = await api.get<PaginatedResponse<RecurringTransaction>>('/recurring-transactions/', {
        params,
    });

    return data.results;
}

export async function createRecurringTransaction(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const parsed = createRecurringTransactionSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: CreateRecurringTransactionInput = {
        account: parsed.data.account,
        category: parsed.data.category,
        amount: parsed.data.amount,
        note: parsed.data.note?.trim() ?? '',
        day_of_month: parsed.data.day_of_month,
        is_active: parsed.data.is_active,
    };

    try {
        await api.post('/recurring-transactions/', input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.recurring);
    revalidatePath(routes.home);
    redirect(routes.recurring);
}

export async function updateRecurringTransaction(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const values = formDataToObject(formData);
    const id = values.id;
    const parsed = updateRecurringTransactionSchema.safeParse(values);

    if (typeof id !== 'string') {
        return { message: 'Invalid recurring payment.' };
    }

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: UpdateRecurringTransactionInput = {
        account: parsed.data.account,
        category: parsed.data.category,
        amount: parsed.data.amount,
        note: parsed.data.note?.trim() ?? '',
        day_of_month: parsed.data.day_of_month,
        is_active: parsed.data.is_active,
    };

    try {
        await api.put(`/recurring-transactions/${id}/`, input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.recurring);
    revalidatePath(routes.home);
    redirect(routes.recurring);
}

export async function deleteRecurringTransaction(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id');

    if (typeof id !== 'string') {
        return { message: 'Invalid recurring payment.' };
    }

    try {
        await api.delete(`/recurring-transactions/${id}/`);
    } catch (error) {
        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.recurring);
    revalidatePath(routes.home);
    redirect(routes.recurring);
}
