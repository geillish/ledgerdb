'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { initialActionState, zodErrorsToFieldErrors, type ActionState } from '@/lib/action-state';
import { routes } from '@/config/routes';
import { formDataToObject, getApiErrorMessage, getApiFieldErrors } from '@/lib/errors';
import { api } from '@/lib/api';
import { createInstitutionSchema, updateInstitutionSchema } from '@/lib/schemas/institution';
import type { CreateInstitutionInput, Institution, UpdateInstitutionInput } from '@/types/institution';
import { DROPDOWN_PAGE_SIZE, type PaginatedResponse } from '@/types/pagination';

type InstitutionListOptions = {
    search?: string;
    page?: number;
};

export async function listInstitutions(options?: InstitutionListOptions): Promise<PaginatedResponse<Institution>> {
    const params: Record<string, string | number> = {};

    if (options?.search) {
        params.search = options.search;
    }

    if (options?.page) {
        params.page = options.page;
    }

    const { data } = await api.get<PaginatedResponse<Institution>>('/institutions/', {
        params: Object.keys(params).length > 0 ? params : undefined,
    });

    return data;
}

export async function getInstitutions(search?: string): Promise<Institution[]> {
    const params: Record<string, string | number> = {
        page_size: DROPDOWN_PAGE_SIZE,
    };

    if (search) {
        params.search = search;
    }

    const { data } = await api.get<PaginatedResponse<Institution>>('/institutions/', { params });

    return data.results;
}

export async function getInstitution(id: string): Promise<Institution> {
    const { data } = await api.get<Institution>(`/institutions/${id}/`);
    return data;
}

export async function createInstitution(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const parsed = createInstitutionSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: CreateInstitutionInput = {
        name: parsed.data.name,
    };

    try {
        await api.post('/institutions/', input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.institutions);
    revalidatePath(routes.accountsNew);
    redirect(routes.institutions);
}

export async function updateInstitution(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const values = formDataToObject(formData);
    const id = values.id;
    const parsed = updateInstitutionSchema.safeParse(values);

    if (typeof id !== 'string') {
        return { message: 'Invalid institution.' };
    }

    if (!parsed.success) {
        return { errors: zodErrorsToFieldErrors(parsed.error) };
    }

    const input: UpdateInstitutionInput = {
        name: parsed.data.name,
    };

    try {
        await api.put(`/institutions/${id}/`, input);
    } catch (error) {
        const fieldErrors = getApiFieldErrors(error);

        if (fieldErrors) {
            return { errors: fieldErrors };
        }

        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.institutions);
    revalidatePath(routes.accountsNew);
    redirect(routes.institutions);
}

export async function deleteInstitution(_prevState: ActionState = initialActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id');

    if (typeof id !== 'string') {
        return { message: 'Invalid institution.' };
    }

    try {
        await api.delete(`/institutions/${id}/`);
    } catch (error) {
        return { message: getApiErrorMessage(error) };
    }

    revalidatePath(routes.institutions);
    revalidatePath(routes.accountsNew);
    redirect(routes.institutions);
}
