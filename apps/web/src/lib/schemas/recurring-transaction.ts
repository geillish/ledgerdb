import { z } from 'zod';

import { TRANSACTION_CATEGORIES } from '@/types/transaction';

export const createRecurringTransactionSchema = z.object({
    account: z.string().uuid('Select an account'),
    category: z.enum(TRANSACTION_CATEGORIES),
    amount: z
        .string()
        .min(1, 'Amount is required')
        .refine(value => Number(value) > 0, 'Amount must be greater than zero'),
    note: z.string().optional(),
    day_of_month: z.coerce.number().int('Day must be a whole number').min(1, 'Day must be between 1 and 28').max(28, 'Day must be between 1 and 28'),
    is_active: z
        .union([z.literal('true'), z.literal('false')])
        .optional()
        .transform(value => value !== 'false'),
});

export const updateRecurringTransactionSchema = createRecurringTransactionSchema.extend({
    id: z.string().uuid(),
});
