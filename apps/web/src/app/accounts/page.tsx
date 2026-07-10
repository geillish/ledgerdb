import { getInstitutions } from '@/actions/institution';
import { listAccounts } from '@/actions/account';
import { AccountsEmpty } from '@/components/accounts/AccountsEmpty';
import { AccountTable } from '@/components/accounts/AccountTable';
import { CreateAccountDialog } from '@/components/accounts/CreateAccountDialog';
import { DataTableCard } from '@/components/layout/DataTableCard';
import { TablePagination } from '@/components/layout/TablePagination';
import { routes } from '@/config/routes';
import { formatPaginationSummary, parsePage } from '@/lib/pagination';
import { PAGE_SIZE } from '@/types/pagination';

type AccountsPageProps = {
    searchParams: Promise<{ page?: string }>;
};

export default async function AccountsPage({ searchParams }: AccountsPageProps) {
    const { page: pageParam } = await searchParams;
    const page = parsePage(pageParam);
    const [accountPage, institutions] = await Promise.all([listAccounts(page), getInstitutions()]);
    const { results: accounts, count } = accountPage;
    const summary = count === 0 ? 'No accounts yet' : formatPaginationSummary(count, page, PAGE_SIZE, 'account', 'accounts');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">{summary}</p>
                <CreateAccountDialog institutions={institutions} />
            </div>

            {count === 0 ? (
                <AccountsEmpty institutions={institutions} />
            ) : (
                <DataTableCard>
                    <AccountTable accounts={accounts} institutions={institutions} />
                    <TablePagination pathname={routes.accounts} page={page} totalCount={count} />
                </DataTableCard>
            )}
        </div>
    );
}
