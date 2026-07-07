'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/format';
import type { DashboardMonthlySpending } from '@/types/dashboard';

const chartConfig = {
    total: {
        label: 'Spending',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

export function MonthlySpendingChart({ data }: { data: DashboardMonthlySpending[] }) {
    const chartData = data.map(item => ({
        label: item.label,
        total: Number.parseFloat(item.total),
    }));
    const hasSpending = chartData.some(item => item.total > 0);

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Spending trend</CardTitle>
                <CardDescription>Last six months of spending, excluding transfers and income.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasSpending ? (
                    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
                        <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
                            <YAxis tickLine={false} axisLine={false} width={72} tickFormatter={value => formatCurrency(value)} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={value => formatCurrency(String(value))} labelFormatter={label => String(label)} />} />
                            <Bar dataKey="total" fill="var(--color-total)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <p className="py-16 text-center text-sm text-muted-foreground">No spending recorded in the last six months.</p>
                )}
            </CardContent>
        </Card>
    );
}
