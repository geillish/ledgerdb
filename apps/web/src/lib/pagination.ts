import { PAGE_SIZE } from '@/types/pagination';

export function parsePage(value?: string): number {
    const page = Number.parseInt(value ?? '1', 10);

    if (Number.isNaN(page) || page < 1) {
        return 1;
    }

    return page;
}

export function getTotalPages(count: number, pageSize = PAGE_SIZE): number {
    return Math.max(1, Math.ceil(count / pageSize));
}

export function formatPaginationSummary(count: number, page: number, pageSize: number, singular: string, plural: string): string {
    if (count === 0) {
        return `No ${plural}`;
    }

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);
    const label = count === 1 ? singular : plural;

    return `Showing ${start}–${end} of ${count} ${label}`;
}

export function buildPageHref(pathname: string, page: number, searchParams: Record<string, string | undefined>): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
        if (key === 'page' || !value) {
            continue;
        }

        params.set(key, value);
    }

    if (page > 1) {
        params.set('page', String(page));
    }

    const query = params.toString();

    return query ? `${pathname}?${query}` : pathname;
}
