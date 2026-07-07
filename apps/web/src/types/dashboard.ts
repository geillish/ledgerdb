import type { AccountType } from '@/types/account';
import type { TransactionCategory } from '@/types/transaction';

export type DashboardAccountBalance = {
    id: string;
    name: string;
    account_type: AccountType;
    institution_name: string;
    current_balance: string;
};

export type DashboardCategorySpending = {
    category: TransactionCategory;
    total: string;
};

export type DashboardMonthlySpending = {
    month: string;
    label: string;
    total: string;
};

export type DashboardGoalSummary = {
    id: string;
    name: string;
    account_name: string;
    target_amount: string;
    current_amount: string;
};

export type Dashboard = {
    net_worth: string;
    total_assets: string;
    total_liabilities: string;
    month: string;
    monthly_spending: string;
    monthly_income: string;
    account_balances: DashboardAccountBalance[];
    spending_by_category: DashboardCategorySpending[];
    spending_by_month: DashboardMonthlySpending[];
    goals: DashboardGoalSummary[];
};
