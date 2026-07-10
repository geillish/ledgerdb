import { Badge } from '@/components/ui/badge';
import { formatAccountType } from '@/lib/format';
import type { AccountType } from '@/types/account';

const ACCOUNT_TYPE_VARIANTS: Record<AccountType, 'info' | 'success' | 'destructive' | 'violet' | 'warning' | 'muted'> = {
    CURRENT: 'info',
    SAVINGS: 'success',
    CREDIT_CARD: 'destructive',
    LOAN: 'destructive',
    PENSION: 'violet',
    CRYPTO: 'warning',
    CASH: 'muted',
};

export function AccountTypeBadge({ type }: { type: AccountType }) {
    return (
        <Badge variant={ACCOUNT_TYPE_VARIANTS[type]} className="font-normal">
            {formatAccountType(type)}
        </Badge>
    );
}
