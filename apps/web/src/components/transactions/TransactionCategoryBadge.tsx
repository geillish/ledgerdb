import { Badge } from '@/components/ui/badge';
import { formatTransactionCategory } from '@/lib/format';
import type { TransactionCategory } from '@/types/transaction';

const CATEGORY_VARIANTS: Record<TransactionCategory, 'default' | 'secondary' | 'outline'> = {
    SALARY: 'default',
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
    TRANSFER: 'outline',
    OTHER: 'secondary',
};

export function TransactionCategoryBadge({ category }: { category: TransactionCategory }) {
    return (
        <Badge variant={CATEGORY_VARIANTS[category]} className="font-normal">
            {formatTransactionCategory(category)}
        </Badge>
    );
}
