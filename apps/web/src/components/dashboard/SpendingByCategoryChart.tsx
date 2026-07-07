'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { formatCurrency, formatTransactionCategory } from '@/lib/format';
import type { DashboardCategorySpending } from '@/types/dashboard';

const chartConfig = {
    total: {
        label: 'Spending',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

function formatMonth(value: string): string {
    const [year, month] = value.split('-');

    return new Intl.DateTimeFormat('en-GB', {
        month: 'long',
        year: 'numeric',
    }).format(new Date(Number(year), Number(month) - 1, 1));
}

export function SpendingByCategoryChart({ data, month }: { data: DashboardCategorySpending[]; month: string }) {
    const chartData = data.map(item => ({
        category: formatTransactionCategory(item.category),
        total: Number.parseFloat(item.total),
    }));

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Spending by category</CardTitle>
                <CardDescription>{formatMonth(month)} breakdown.</CardDescription>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={value => formatCurrency(value)} />
                            <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} width={96} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={value => formatCurrency(String(value))} labelFormatter={label => String(label)} />} />
                            <Bar dataKey="total" fill="var(--color-total)" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <p className="py-16 text-center text-sm text-muted-foreground">No spending recorded this month.</p>
                )}
            </CardContent>
        </Card>
    );
}
