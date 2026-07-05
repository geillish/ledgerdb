import { CreateInstitutionDialog } from '@/components/institutions/CreateInstitutionDialog';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function InstitutionsEmpty() {
    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>No institutions yet</CardTitle>
                <CardDescription>Add banks and financial institutions before creating accounts.</CardDescription>
                <CreateInstitutionDialog className="w-fit" />
            </CardHeader>
        </Card>
    );
}
