import { z } from 'zod';

import { ACCOUNT_TYPES } from '@/types/account';

export const createAccountSchema = z.object({
    institution: z.string().uuid('Select an institution'),
    name: z.string().trim().min(1, 'Name is required').max(100),
    account_type: z.enum(ACCOUNT_TYPES),
    opening_balance: z
        .string()
        .min(1, 'Opening balance is required')
        .refine(value => !Number.isNaN(Number(value)), 'Enter a valid amount'),
    notes: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.extend({
    id: z.string().uuid(),
});
