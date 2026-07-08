import { APP_CURRENCY, APP_LOCALE } from '@/config/locale';
import { ACCOUNT_TYPE_LABELS, type AccountType } from '@/types/account';
import { TRANSACTION_CATEGORY_LABELS, type TransactionCategory } from '@/types/transaction';

export function formatCurrency(amount: string | number): string {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;

    return new Intl.NumberFormat(APP_LOCALE, {
        style: 'currency',
        currency: APP_CURRENCY,
    }).format(value);
}

export function formatAccountType(type: AccountType): string {
    return ACCOUNT_TYPE_LABELS[type];
}

export function formatTransactionCategory(category: TransactionCategory): string {
    return TRANSACTION_CATEGORY_LABELS[category];
}

export function formatDate(value: string): string {
    return new Intl.DateTimeFormat(APP_LOCALE, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}
