import { Target, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import type { Dashboard } from '@/types/dashboard';

function formatMonth(value: string): string {
    const [year, month] = value.split('-');

    return new Intl.DateTimeFormat('en-GB', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(Number(year), Number(month) - 1, 1));
}

type StatCardProps = {
    title: string;
    description: string;
    value: string;
    icon: React.ReactNode;
};

function StatCard({ title, description, value, icon }: StatCardProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <div className="rounded-lg bg-muted p-2 text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <p className="font-serif text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
            </CardContent>
        </Card>
    );
}

export function DashboardStats({ dashboard }: { dashboard: Dashboard }) {
    const monthLabel = formatMonth(dashboard.month);

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Net worth" description="Assets minus liabilities" value={formatCurrency(dashboard.net_worth)} icon={<Wallet className="size-4" />} />
            <StatCard title="Monthly spending" description={monthLabel} value={formatCurrency(dashboard.monthly_spending)} icon={<TrendingDown className="size-4" />} />
            <StatCard title="Monthly income" description={monthLabel} value={formatCurrency(dashboard.monthly_income)} icon={<TrendingUp className="size-4" />} />
            <StatCard title="Active goals" description="Savings targets in progress" value={String(dashboard.goals.length)} icon={<Target className="size-4" />} />
        </div>
    );
}
