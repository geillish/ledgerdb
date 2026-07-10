import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DashboardSpendable } from '@/types/dashboard';

function formatDueDay(day: number): string {
    const suffix =
        day % 10 === 1 && day !== 11
            ? 'st'
            : day % 10 === 2 && day !== 12
              ? 'nd'
              : day % 10 === 3 && day !== 13
                ? 'rd'
                : 'th';

    return `${day}${suffix}`;
}

function breakdownAmountClass(type: DashboardSpendable['breakdown'][number]['type']): string {
    if (type === 'income') {
        return 'text-emerald-700 dark:text-emerald-400';
    }

    if (type === 'expense') {
        return 'text-red-700 dark:text-red-400';
    }

    return 'text-foreground';
}

export function SpendableCard({ spendable }: { spendable: DashboardSpendable }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle>Spendable this month</CardTitle>
                    <CardDescription>Included account balances plus upcoming income, minus bills still due this month.</CardDescription>
                </div>
                <ButtonLink href={routes.recurring} variant="outline" size="sm">
                    Manage recurring
                </ButtonLink>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="font-serif text-4xl font-semibold tracking-tight tabular-nums">{formatCurrency(spendable.total)}</p>

                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border bg-muted/30 px-4 py-3">
                        <p className="text-xs text-muted-foreground">Included balances</p>
                        <p className="mt-1 font-medium tabular-nums">{formatCurrency(spendable.account_balances_total)}</p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 px-4 py-3">
                        <p className="text-xs text-muted-foreground">Upcoming income</p>
                        <p className="mt-1 font-medium tabular-nums text-emerald-700 dark:text-emerald-400">
                            +{formatCurrency(spendable.upcoming_income_total)}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 px-4 py-3">
                        <p className="text-xs text-muted-foreground">Upcoming bills</p>
                        <p className="mt-1 font-medium tabular-nums text-red-700 dark:text-red-400">
                            −{formatCurrency(spendable.upcoming_expenses_total)}
                        </p>
                    </div>
                </div>

                {spendable.breakdown.length > 0 ? (
                    <ul className="divide-y rounded-lg border">
                        {spendable.breakdown.map(item => (
                            <li key={`${item.type}-${item.label}-${item.due_day ?? 'account'}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                                <div>
                                    <p className="font-medium">{item.label}</p>
                                    {item.due_day ? (
                                        <p className="text-xs text-muted-foreground">Due {formatDueDay(item.due_day)}</p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">Current balance</p>
                                    )}
                                </div>
                                <span className={cn('font-medium tabular-nums', breakdownAmountClass(item.type))}>
                                    {item.type === 'income' ? '+' : ''}
                                    {formatCurrency(item.amount)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No spendable accounts configured yet. Enable spendable on a current account to get started.
                    </p>
                )}

                <p className="text-xs text-muted-foreground">
                    Savings pots are excluded by default. Edit an account to include it in spendable calculations.
                </p>
            </CardContent>
        </Card>
    );
}
