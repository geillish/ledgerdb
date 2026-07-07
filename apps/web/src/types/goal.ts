export type Goal = {
    id: string;
    account: string;
    account_name: string;
    current_amount: string;
    name: string;
    target_amount: string;
    target_date: string | null;
    notes: string;
    date_created: string;
    date_updated: string;
};

export type CreateGoalInput = {
    account: string;
    name: string;
    target_amount: string;
    target_date?: string | null;
    notes?: string;
};

export type UpdateGoalInput = CreateGoalInput;

export type GoalFilters = {
    account?: string;
};
