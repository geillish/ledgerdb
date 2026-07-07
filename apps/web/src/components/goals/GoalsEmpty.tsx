import type { Account } from '@/types/account';

import { CreateGoalDialog } from './CreateGoalDialog';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function GoalsEmpty({ accounts }: { accounts: Account[] }) {
    return (
        <Card className="w-full shadow-sm">
            <CardHeader>
                <CardTitle>No goals yet</CardTitle>
                <CardDescription>Set a savings target and track progress against your account balance.</CardDescription>
                <CreateGoalDialog accounts={accounts} className="w-fit" />
            </CardHeader>
        </Card>
    );
}
