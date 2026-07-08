import { Badge } from '@/components/ui/badge';
import { formatTransactionCategory } from '@/lib/format';
import type { TransactionCategory } from '@/types/transaction';

const CATEGORY_VARIANTS: Record<TransactionCategory, 'default' | 'secondary' | 'outline'> = {
    SALARY: 'default',
    OTHER_INCOME: 'default',
    TRANSFER_IN: 'outline',
    GROCERIES: 'secondary',
    RENT: 'secondary',
    MORTGAGE: 'secondary',
    BILLS: 'secondary',
    TRANSPORT: 'outline',
    SHOPPING: 'outline',
    DINING: 'outline',
    HEALTH: 'secondary',
    ENTERTAINMENT: 'outline',
    SAVINGS: 'outline',
    PENSION: 'outline',
    INVESTMENT: 'outline',
    TRANSFER_OUT: 'outline',
    OTHER: 'secondary',
};

export function TransactionCategoryBadge({ category }: { category: TransactionCategory }) {
    return (
        <Badge variant={CATEGORY_VARIANTS[category]} className="font-normal">
            {formatTransactionCategory(category)}
        </Badge>
    );
}
