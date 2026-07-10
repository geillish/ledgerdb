import { z } from 'zod';

import { ACCOUNT_TYPES } from '@/types/account';

export const createAccountSchema = z.object({
    institution: z.string().uuid('Select an institution'),
    name: z.string().trim().min(1, 'Name is required').max(100),
    account_type: z.enum(ACCOUNT_TYPES),
    current_balance: z
        .string()
        .min(1, 'Current balance is required')
        .refine(value => !Number.isNaN(Number(value)), 'Enter a valid amount'),
    notes: z.string().optional(),
});

export const updateAccountSchema = z.object({
    id: z.string().uuid(),
    institution: z.string().uuid('Select an institution'),
    name: z.string().trim().min(1, 'Name is required').max(100),
    account_type: z.enum(ACCOUNT_TYPES),
    notes: z.string().optional(),
    include_in_spendable: z
        .union([z.literal('true'), z.literal('false')])
        .optional()
        .transform(value => value !== 'false'),
});
