import type { TransactionCategory } from '@/types/transaction';

export type RecurringTransaction = {
    id: string;
    account: string;
    account_name: string;
    category: TransactionCategory;
    amount: string;
    note: string;
    day_of_month: number;
    is_active: boolean;
    date_created: string;
    date_updated: string;
};

export type CreateRecurringTransactionInput = {
    account: string;
    category: TransactionCategory;
    amount: string;
    note?: string;
    day_of_month: number;
    is_active?: boolean;
};

export type UpdateRecurringTransactionInput = CreateRecurringTransactionInput;

export type RecurringTransactionFilters = {
    account?: string;
    page?: number;
};
