'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { initialActionState, zodErrorsToFieldErrors, type ActionState } from '@/lib/action-state';
import { routes } from '@/config/routes';
import { formDataToObject, getApiErrorMessage, getApiFieldErrors } from '@/lib/errors';
import { api } from '@/lib/api';
import { createGoalSchema, updateGoalSchema } from '@/lib/schemas/goal';
import type { CreateGoalInput, Goal, GoalFilters, UpdateGoalInput } from '@/types/goal';
import { DROPDOWN_PAGE_SIZE, type PaginatedResponse } from '@/types/pagination';

export async function listGoals(filters?: GoalFilters): Promise<PaginatedResponse<Goal>> {
    const params: Record<string, string | number> = {};

    if (filters?.account) {
        params.account = filters.account;
    }

    if (filters?.page) {
        params.page = filters.page;
    }

    const { data } = await api.get<PaginatedResponse<Goal>>('/goals/', {
        params: Object.keys(params).length > 0 ? params : undefined,
    });

    return data;
}

export async function getGoals(filters?: Omit<GoalFilters, 'page'>): Promise<Goal[]> {
    const params: Record<string, string | number> = {
        page_size: DROPDOWN_PAGE_SIZE,
    };

    if (filters?.account) {
        params.account = filters.account;
    }

    const { data } = await api.get<PaginatedResponse<Goal>>('/goals/', { params });

    return data.results;
}

export async function createGoal(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const parsed = createGoalSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: CreateGoalInput = {
        account: parsed.data.account,
        name: parsed.data.name,
        target_amount: parsed.data.target_amount,
        target_date: parsed.data.target_date?.trim() || null,
        notes: parsed.data.notes?.trim() ?? '',
    };

    try {
        await api.post('/goals/', input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.goals);
    redirect(routes.goals);
}

export async function updateGoal(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const values = formDataToObject(formData);
    const id = values.id;
    const parsed = updateGoalSchema.safeParse(values);

    if (typeof id !== 'string') {
        return { message: 'Invalid goal.' };
    }

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: UpdateGoalInput = {
        account: parsed.data.account,
        name: parsed.data.name,
        target_amount: parsed.data.target_amount,
        target_date: parsed.data.target_date?.trim() || null,
        notes: parsed.data.notes?.trim() ?? '',
    };

    try {
        await api.put(`/goals/${id}/`, input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.goals);
    redirect(routes.goals);
}

export async function deleteGoal(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id');

    if (typeof id !== 'string') {
        return { message: 'Invalid goal.' };
    }

    try {
        await api.delete(`/goals/${id}/`);
    } catch (error) {
        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.goals);
    redirect(routes.goals);
}
