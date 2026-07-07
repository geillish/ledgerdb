import { z } from 'zod';

const amountSchema = z
    .string()
    .min(1, 'Target amount is required')
    .refine(value => !Number.isNaN(Number(value)), 'Enter a valid amount')
    .refine(value => Number(value) > 0, 'Target amount must be greater than zero');

const optionalDateSchema = z
    .string()
    .optional()
    .refine(value => !value || !Number.isNaN(Date.parse(value)), 'Enter a valid date');

export const createGoalSchema = z.object({
    account: z.string().uuid('Select an account'),
    name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
    target_amount: amountSchema,
    target_date: optionalDateSchema,
    notes: z.string().optional(),
});

export const updateGoalSchema = createGoalSchema.extend({
    id: z.string().uuid(),
});
