'use server';

import { api } from '@/lib/api';
import type { Institution } from '@/types/institution';

export async function getInstitutions(): Promise<Institution[]> {
    const { data } = await api.get<Institution[]>('/institutions/');
    return data;
}
