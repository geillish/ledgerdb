import { getDashboard } from '@/actions/dashboard';
import { AccountBalancesCard } from '@/components/dashboard/AccountBalancesCard';
import { DashboardEmpty } from '@/components/dashboard/DashboardEmpty';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { GoalsSummaryCard } from '@/components/dashboard/GoalsSummaryCard';
import { MonthlySpendingChart } from '@/components/dashboard/MonthlySpendingChart';
import { SpendingByCategoryChart } from '@/components/dashboard/SpendingByCategoryChart';

export default async function DashboardPage() {
    const dashboard = await getDashboard();
    const isEmpty = dashboard.account_balances.length === 0;

    if (isEmpty) {
        return <DashboardEmpty />;
    }

    return (
        <div className="space-y-8">
            <DashboardStats dashboard={dashboard} />

            <div className="grid gap-6 xl:grid-cols-2">
                <MonthlySpendingChart data={dashboard.spending_by_month} />
                <SpendingByCategoryChart data={dashboard.spending_by_category} month={dashboard.month} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <AccountBalancesCard accounts={dashboard.account_balances} netWorth={dashboard.net_worth} />
                <GoalsSummaryCard goals={dashboard.goals} />
            </div>
        </div>
    );
}
