export const TRANSACTION_CATEGORIES = [
    'SALARY',
    'OTHER_INCOME',
    'TRANSFER_IN',
    'GROCERIES',
    'RENT',
    'MORTGAGE',
    'BILLS',
    'TRANSPORT',
    'SHOPPING',
    'DINING',
    'HEALTH',
    'ENTERTAINMENT',
    'SAVINGS',
    'PENSION',
    'INVESTMENT',
    'TRANSFER_OUT',
    'OTHER',
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
    SALARY: 'Salary',
    OTHER_INCOME: 'Other',
    TRANSFER_IN: 'Transfer in',
    GROCERIES: 'Groceries',
    RENT: 'Rent',
    MORTGAGE: 'Mortgage',
    BILLS: 'Bills',
    TRANSPORT: 'Transport',
    SHOPPING: 'Shopping',
    DINING: 'Dining Out',
    HEALTH: 'Health',
    ENTERTAINMENT: 'Entertainment',
    SAVINGS: 'Savings',
    PENSION: 'Pension',
    INVESTMENT: 'Investment',
    TRANSFER_OUT: 'Transfer out',
    OTHER: 'Other expense',
};

export type Transaction = {
    id: string;
    account: string;
    account_name: string;
    transaction_date: string;
    category: TransactionCategory;
    amount: string;
    note: string;
    date_created: string;
    date_updated: string;
};

export type CreateTransactionInput = {
    account: string;
    transaction_date: string;
    category: TransactionCategory;
    amount: string;
    note?: string;
};

export type UpdateTransactionInput = CreateTransactionInput;

export type TransactionFilters = {
    account?: string;
    category?: string;
    page?: number;
};
