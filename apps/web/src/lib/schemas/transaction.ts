import { z } from 'zod';

import { TRANSACTION_CATEGORIES } from '@/types/transaction';

const amountSchema = z
    .string()
    .min(1, 'Amount is required')
    .refine(value => !Number.isNaN(Number(value)), 'Enter a valid amount')
    .refine(value => Number(value) > 0, 'Enter a positive amount — category controls whether it is income or expense');

export const createTransactionSchema = z.object({
    account: z.string().uuid('Select an account'),
    transaction_date: z.string().min(1, 'Date is required'),
    category: z.enum(TRANSACTION_CATEGORIES),
    amount: amountSchema,
    note: z.string().optional(),
});

export const updateTransactionSchema = createTransactionSchema.extend({
    id: z.string().uuid(),
});
