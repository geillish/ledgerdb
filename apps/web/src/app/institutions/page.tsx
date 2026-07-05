import { getInstitutions } from '@/actions/institution';
import { DataTableCard } from '@/components/layout/DataTableCard';
import { CreateInstitutionDialog } from '@/components/institutions/CreateInstitutionDialog';
import { InstitutionSearch } from '@/components/institutions/InstitutionSearch';
import { InstitutionTable } from '@/components/institutions/InstitutionTable';
import { InstitutionsEmpty } from '@/components/institutions/InstitutionsEmpty';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type InstitutionsPageProps = {
    searchParams: Promise<{ search?: string }>;
};

export default async function InstitutionsPage({ searchParams }: InstitutionsPageProps) {
    const { search } = await searchParams;
    const institutions = await getInstitutions(search);
    const hasSearch = Boolean(search?.trim());

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <InstitutionSearch query={search} />
                <CreateInstitutionDialog />
            </div>

            <p className="text-sm text-muted-foreground">{institutions.length === 0 ? (hasSearch ? 'No institutions match your search' : 'No institutions yet') : `${institutions.length} institution${institutions.length === 1 ? '' : 's'}`}</p>

            {institutions.length === 0 && !hasSearch ? (
                <InstitutionsEmpty />
            ) : institutions.length === 0 && hasSearch ? (
                <Card className="max-w-lg shadow-sm">
                    <CardHeader>
                        <CardTitle>No results</CardTitle>
                        <CardDescription>Try a different search term or add a new institution.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <DataTableCard>
                    <InstitutionTable institutions={institutions} />
                </DataTableCard>
            )}
        </div>
    );
}
