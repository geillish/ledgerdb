import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { TRANSACTION_CATEGORY_LABELS, TRANSACTION_CATEGORIES } from '@/types/transaction';
import type { Account } from '@/types/account';

type TransactionFiltersProps = {
    account?: string;
    category?: string;
    accounts: Account[];
};

export function TransactionFilters({ account, category, accounts }: TransactionFiltersProps) {
    return (
        <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select name="account" defaultValue={account ?? ''} className="sm:max-w-xs">
                <option value="">All accounts</option>
                {accounts.map(item => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </Select>
            <Select name="category" defaultValue={category ?? ''} className="sm:max-w-xs">
                <option value="">All categories</option>
                {TRANSACTION_CATEGORIES.map(item => (
                    <option key={item} value={item}>
                        {TRANSACTION_CATEGORY_LABELS[item]}
                    </option>
                ))}
            </Select>
            <Button type="submit" variant="outline" size="sm" className="w-fit">
                Apply filters
            </Button>
        </form>
    );
}
