import type { Institution } from '@/types/institution';

import { CreateAccountDialog } from './CreateAccountDialog';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AccountsEmpty({ institutions }: { institutions: Institution[] }) {
    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>No accounts yet</CardTitle>
                <CardDescription>Get started by adding your first financial account.</CardDescription>
                <CreateAccountDialog institutions={institutions} className="w-fit" />
            </CardHeader>
        </Card>
    );
}
