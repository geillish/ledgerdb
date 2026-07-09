import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { buildPageHref, getTotalPages } from '@/lib/pagination';
import { PAGE_SIZE } from '@/types/pagination';

type TablePaginationProps = {
    pathname: string;
    page: number;
    totalCount: number;
    pageSize?: number;
    searchParams?: Record<string, string | undefined>;
};

export function TablePagination({
    pathname,
    page,
    totalCount,
    pageSize = PAGE_SIZE,
    searchParams = {},
}: TablePaginationProps) {
    const totalPages = getTotalPages(totalCount, pageSize);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-4 border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
                {page > 1 ? (
                    <ButtonLink href={buildPageHref(pathname, page - 1, searchParams)} variant="outline" size="sm">
                        Previous
                    </ButtonLink>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                )}
                {page < totalPages ? (
                    <ButtonLink href={buildPageHref(pathname, page + 1, searchParams)} variant="outline" size="sm">
                        Next
                    </ButtonLink>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}
