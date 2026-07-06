import type { Account } from '@/types/account';

import { CreateTransactionDialog } from './CreateTransactionDialog';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TransactionsEmpty({ accounts, defaultDate }: { accounts: Account[]; defaultDate: string }) {
    return (
        <Card className="w-full shadow-sm">
            <CardHeader>
                <CardTitle>No transactions yet</CardTitle>
                <CardDescription>Get started by recording your first income or expense.</CardDescription>
                <CreateTransactionDialog accounts={accounts} defaultDate={defaultDate} className="w-fit" />
            </CardHeader>
        </Card>
    );
}
