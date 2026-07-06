export const TRANSACTION_CATEGORIES = ['SALARY', 'GROCERIES', 'RENT', 'MORTGAGE', 'BILLS', 'TRANSPORT', 'SHOPPING', 'DINING', 'HEALTH', 'ENTERTAINMENT', 'SAVINGS', 'PENSION', 'INVESTMENT', 'TRANSFER', 'OTHER'] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
    SALARY: 'Salary',
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
    TRANSFER: 'Transfer',
    OTHER: 'Other',
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
};
