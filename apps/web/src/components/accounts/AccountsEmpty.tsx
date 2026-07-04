import { Plus } from 'lucide-react';

import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/config/routes';

export function AccountsEmpty() {
    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>No accounts yet</CardTitle>
                <CardDescription>Get started by adding your first financial account.</CardDescription>
                <ButtonLink className="w-fit" href={routes.accountsNew}>
                    <Plus className="size-4" />
                    Add account
                </ButtonLink>
            </CardHeader>
        </Card>
    );
}
