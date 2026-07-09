import { Badge } from '@/components/ui/badge';
import { formatTransactionCategory } from '@/lib/format';
import { getTransactionDirection } from '@/lib/transaction';
import type { TransactionCategory } from '@/types/transaction';

const DIRECTION_VARIANTS = {
    income: 'success',
    expense: 'destructive',
    transfer: 'info',
} as const;

export function TransactionCategoryBadge({ category }: { category: TransactionCategory }) {
    const direction = getTransactionDirection(category);

    return (
        <Badge variant={DIRECTION_VARIANTS[direction]} className="font-normal">
            {formatTransactionCategory(category)}
        </Badge>
    );
}
