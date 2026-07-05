import { Badge } from '@/components/ui/badge';
import { formatAccountType } from '@/lib/format';
import type { AccountType } from '@/types/account';

const ACCOUNT_TYPE_VARIANTS: Record<AccountType, 'secondary' | 'outline' | 'destructive'> = {
    CURRENT: 'secondary',
    SAVINGS: 'secondary',
    CREDIT_CARD: 'destructive',
    LOAN: 'destructive',
    PENSION: 'outline',
    CRYPTO: 'outline',
    CASH: 'outline',
};

export function AccountTypeBadge({ type }: { type: AccountType }) {
    return (
        <Badge variant={ACCOUNT_TYPE_VARIANTS[type]} className="font-normal">
            {formatAccountType(type)}
        </Badge>
    );
}
