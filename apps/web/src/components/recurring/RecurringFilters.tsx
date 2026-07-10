import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { Account } from '@/types/account';

type RecurringFiltersProps = {
    account?: string;
    accounts: Account[];
};

export function RecurringFilters({ account, accounts }: RecurringFiltersProps) {
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
            <Button type="submit" variant="outline" size="sm" className="w-fit">
                Apply filters
            </Button>
        </form>
    );
}
