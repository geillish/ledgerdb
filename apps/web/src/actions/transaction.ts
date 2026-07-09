'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { initialActionState, zodErrorsToFieldErrors, type ActionState } from '@/lib/action-state';
import { routes } from '@/config/routes';
import { formDataToObject, getApiErrorMessage, getApiFieldErrors } from '@/lib/errors';
import { api } from '@/lib/api';
import { createTransactionSchema, updateTransactionSchema } from '@/lib/schemas/transaction';
import type { CreateTransactionInput, Transaction, TransactionFilters, UpdateTransactionInput } from '@/types/transaction';
import { DROPDOWN_PAGE_SIZE, type PaginatedResponse } from '@/types/pagination';

export async function listTransactions(filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    const params: Record<string, string | number> = {};

    if (filters?.account) {
        params.account = filters.account;
    }

    if (filters?.category) {
        params.category = filters.category;
    }

    if (filters?.page) {
        params.page = filters.page;
    }

    const { data } = await api.get<PaginatedResponse<Transaction>>('/transactions/', {
        params: Object.keys(params).length > 0 ? params : undefined,
    });

    return data;
}

export async function getTransactions(filters?: Omit<TransactionFilters, 'page'>): Promise<Transaction[]> {
    const params: Record<string, string | number> = {
        page_size: DROPDOWN_PAGE_SIZE,
    };

    if (filters?.account) {
        params.account = filters.account;
    }

    if (filters?.category) {
        params.category = filters.category;
    }

    const { data } = await api.get<PaginatedResponse<Transaction>>('/transactions/', { params });

    return data.results;
}

export async function createTransaction(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const parsed = createTransactionSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: CreateTransactionInput = {
        account: parsed.data.account,
        transaction_date: parsed.data.transaction_date,
        category: parsed.data.category,
        amount: parsed.data.amount,
        note: parsed.data.note?.trim() ?? '',
    };

    try {
        await api.post('/transactions/', input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.transactions);
    revalidatePath(routes.accounts);
    revalidatePath(routes.goals);
    revalidatePath(routes.home);
    redirect(routes.transactions);
}

export async function updateTransaction(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const values = formDataToObject(formData);
    const id = values.id;
    const parsed = updateTransactionSchema.safeParse(values);

    if (typeof id !== 'string') {
        return { message: 'Invalid transaction.' };
    }

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: UpdateTransactionInput = {
        account: parsed.data.account,
        transaction_date: parsed.data.transaction_date,
        category: parsed.data.category,
        amount: parsed.data.amount,
        note: parsed.data.note?.trim() ?? '',
    };

    try {
        await api.put(`/transactions/${id}/`, input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.transactions);
    revalidatePath(routes.accounts);
    revalidatePath(routes.goals);
    revalidatePath(routes.home);
    redirect(routes.transactions);
}

export async function deleteTransaction(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id');

    if (typeof id !== 'string') {
        return { message: 'Invalid transaction.' };
    }

    try {
        await api.delete(`/transactions/${id}/`);
    } catch (error) {
        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.transactions);
    revalidatePath(routes.accounts);
    revalidatePath(routes.goals);
    revalidatePath(routes.home);
    redirect(routes.transactions);
}
