import { Plus } from 'lucide-react';

import { getInstitutions } from '@/actions/institution';
import { InstitutionSearch } from '@/components/institutions/InstitutionSearch';
import { InstitutionTable } from '@/components/institutions/InstitutionTable';
import { InstitutionsEmpty } from '@/components/institutions/InstitutionsEmpty';
import { ButtonLink } from '@/components/ui/button-link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/config/routes';

type InstitutionsPageProps = {
    searchParams: Promise<{ search?: string }>;
};

export default async function InstitutionsPage({ searchParams }: InstitutionsPageProps) {
    const { search } = await searchParams;
    const institutions = await getInstitutions(search);
    const hasSearch = Boolean(search?.trim());

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <InstitutionSearch query={search} />
                {institutions.length > 0 && (
                    <ButtonLink href={routes.institutionsNew}>
                        <Plus className="size-4" />
                        Add institution
                    </ButtonLink>
                )}
            </div>

            <p className="text-sm text-muted-foreground">{institutions.length === 0 ? (hasSearch ? 'No institutions match your search' : 'No institutions to display') : `${institutions.length} institution${institutions.length === 1 ? '' : 's'}`}</p>

            {institutions.length === 0 && !hasSearch ? (
                <InstitutionsEmpty />
            ) : institutions.length === 0 && hasSearch ? (
                <Card className="max-w-lg">
                    <CardHeader>
                        <CardTitle>No results</CardTitle>
                        <CardDescription>Try a different search term or add a new institution.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <InstitutionTable institutions={institutions} />
            )}
        </div>
    );
}
