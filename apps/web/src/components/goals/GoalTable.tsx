import { GoalProgress } from '@/components/goals/GoalProgress';
import { GoalRowActions } from '@/components/goals/GoalRowActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Account } from '@/types/account';
import type { Goal } from '@/types/goal';

export function GoalTable({ goals, accounts }: { goals: Goal[]; accounts: Account[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                    <TableHead>Target date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {goals.map(goal => (
                    <TableRow key={goal.id}>
                        <TableCell className="font-medium">{goal.name}</TableCell>
                        <TableCell>{goal.account_name}</TableCell>
                        <TableCell>
                            <GoalProgress currentAmount={goal.current_amount} targetAmount={goal.target_amount} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(goal.target_amount)}</TableCell>
                        <TableCell>{goal.target_date ? formatDate(goal.target_date) : '—'}</TableCell>
                        <TableCell className="text-right">
                            <GoalRowActions goal={goal} accounts={accounts} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
