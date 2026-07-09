import { listInstitutions } from '@/actions/institution';
import { DataTableCard } from '@/components/layout/DataTableCard';
import { TablePagination } from '@/components/layout/TablePagination';
import { CreateInstitutionDialog } from '@/components/institutions/CreateInstitutionDialog';
import { InstitutionSearch } from '@/components/institutions/InstitutionSearch';
import { InstitutionTable } from '@/components/institutions/InstitutionTable';
import { InstitutionsEmpty } from '@/components/institutions/InstitutionsEmpty';
import { routes } from '@/config/routes';
import { formatPaginationSummary, parsePage } from '@/lib/pagination';
import { PAGE_SIZE } from '@/types/pagination';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type InstitutionsPageProps = {
    searchParams: Promise<{ search?: string; page?: string }>;
};

export default async function InstitutionsPage({ searchParams }: InstitutionsPageProps) {
    const { search, page: pageParam } = await searchParams;
    const page = parsePage(pageParam);
    const institutionPage = await listInstitutions({ search, page });
    const { results: institutions, count } = institutionPage;
    const hasSearch = Boolean(search?.trim());
    const summary = hasSearch
        ? count === 0
            ? 'No institutions match your search'
            : formatPaginationSummary(count, page, PAGE_SIZE, 'institution', 'institutions')
        : count === 0
          ? 'No institutions yet'
          : formatPaginationSummary(count, page, PAGE_SIZE, 'institution', 'institutions');

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <InstitutionSearch query={search} />
                <CreateInstitutionDialog />
            </div>

            <p className="text-sm text-muted-foreground">{summary}</p>

            {count === 0 && !hasSearch ? (
                <InstitutionsEmpty />
            ) : count === 0 && hasSearch ? (
                <Card className="max-w-lg shadow-sm">
                    <CardHeader>
                        <CardTitle>No results</CardTitle>
                        <CardDescription>Try a different search term or add a new institution.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <DataTableCard>
                    <InstitutionTable institutions={institutions} />
                    <TablePagination
                        pathname={routes.institutions}
                        page={page}
                        totalCount={count}
                        searchParams={{ search }}
                    />
                </DataTableCard>
            )}
        </div>
    );
}
