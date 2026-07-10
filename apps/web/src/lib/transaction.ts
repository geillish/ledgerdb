import { formatCurrency } from '@/lib/format';
import { TRANSACTION_CATEGORY_LABELS, TRANSACTION_CATEGORIES, type TransactionCategory } from '@/types/transaction';

export const INCOME_CATEGORIES = ['SALARY', 'OTHER_INCOME'] as const satisfies readonly TransactionCategory[];

export const TRANSFER_CATEGORIES = ['TRANSFER_IN', 'TRANSFER_OUT'] as const satisfies readonly TransactionCategory[];

export const EXPENSE_CATEGORIES = TRANSACTION_CATEGORIES.filter(category => !INCOME_CATEGORIES.includes(category as (typeof INCOME_CATEGORIES)[number]) && !TRANSFER_CATEGORIES.includes(category as (typeof TRANSFER_CATEGORIES)[number]));

export type TransactionDirection = 'income' | 'expense' | 'transfer';

export function getTransactionDirection(category: TransactionCategory): TransactionDirection {
    if (INCOME_CATEGORIES.includes(category as (typeof INCOME_CATEGORIES)[number])) {
        return 'income';
    }

    if (category === 'TRANSFER_IN') {
        return 'income';
    }

    if (category === 'TRANSFER_OUT') {
        return 'transfer';
    }

    return 'expense';
}

export function formatSignedTransactionAmount(category: TransactionCategory, amount: string | number): string {
    const formatted = formatCurrency(amount);
    const direction = getTransactionDirection(category);

    if (direction === 'income') {
        return `+${formatted}`;
    }

    return `−${formatted}`;
}

export function getTransactionAmountColorClass(category: TransactionCategory): string {
    const direction = getTransactionDirection(category);

    if (direction === 'income') {
        return 'text-emerald-700 dark:text-emerald-400';
    }

    return 'text-red-700 dark:text-red-400';
}

export function getTransactionDirectionLabel(category: TransactionCategory): string {
    const direction = getTransactionDirection(category);

    if (direction === 'income') {
        return 'Adds to balance';
    }

    if (direction === 'transfer') {
        return 'Subtracts from balance (outgoing transfer)';
    }

    return 'Subtracts from balance (expense)';
}

export const TRANSACTION_CATEGORY_GROUPS = [
    { label: 'Income', categories: INCOME_CATEGORIES },
    { label: 'Transfers', categories: TRANSFER_CATEGORIES },
    { label: 'Expenses', categories: EXPENSE_CATEGORIES },
] as const;

export function renderTransactionCategoryLabel(category: TransactionCategory): string {
    return TRANSACTION_CATEGORY_LABELS[category];
}
