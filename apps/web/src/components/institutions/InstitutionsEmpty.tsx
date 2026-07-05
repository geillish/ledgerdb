import { Plus } from 'lucide-react';

import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/config/routes';

export function InstitutionsEmpty() {
    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>No institutions yet</CardTitle>
                <CardDescription>Add banks and financial institutions before creating accounts.</CardDescription>
                <ButtonLink className="w-fit" href={routes.institutionsNew}>
                    <Plus className="size-4" />
                    Add institution
                </ButtonLink>
            </CardHeader>
        </Card>
    );
}
