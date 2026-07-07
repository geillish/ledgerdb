import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/config/routes';

export function DashboardEmpty() {
    return (
        <Card className="w-full shadow-sm">
            <CardHeader>
                <CardTitle>Your dashboard is empty</CardTitle>
                <CardDescription>Add an account to see balances, spending, and goal progress here.</CardDescription>
                <div className="flex flex-wrap gap-3">
                    <ButtonLink href={routes.accountsNew}>
                        <Plus className="size-4" />
                        Add account
                    </ButtonLink>
                    <Button variant="outline" render={<Link href={routes.institutions} />}>
                        Manage institutions
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
}
