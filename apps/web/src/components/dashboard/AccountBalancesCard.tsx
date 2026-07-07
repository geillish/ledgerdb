import { AccountTypeBadge } from '@/components/accounts/AccountTypeBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import type { DashboardAccountBalance } from '@/types/dashboard';

export function AccountBalancesCard({ accounts, netWorth }: { accounts: DashboardAccountBalance[]; netWorth: string }) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Account balances</CardTitle>
                <CardDescription>Current balances across all accounts. Net worth: {formatCurrency(netWorth)}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {accounts.map(account => (
                    <div key={account.id} className="flex items-center justify-between gap-4 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
                        <div className="min-w-0 space-y-1">
                            <p className="truncate font-medium">{account.name}</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <AccountTypeBadge type={account.account_type} />
                                <span className="text-xs text-muted-foreground">{account.institution_name}</span>
                            </div>
                        </div>
                        <p className="shrink-0 text-right font-medium tabular-nums">{formatCurrency(account.current_balance)}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
