export const ACCOUNT_TYPES = ['CURRENT', 'SAVINGS', 'CREDIT_CARD', 'LOAN', 'PENSION', 'CRYPTO', 'CASH'] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
    CURRENT: 'Current',
    SAVINGS: 'Savings',
    CREDIT_CARD: 'Credit Card',
    LOAN: 'Loan',
    PENSION: 'Pension',
    CRYPTO: 'Crypto',
    CASH: 'Cash',
};

export type Account = {
    id: string;
    institution: string;
    institution_name: string;
    name: string;
    account_type: AccountType;
    opening_balance: string;
    notes: string;
    date_created: string;
    date_updated: string;
};

export type CreateAccountInput = {
    institution: string;
    name: string;
    account_type: AccountType;
    opening_balance: string;
    notes?: string;
};
