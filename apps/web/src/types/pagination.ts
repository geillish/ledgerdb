export const PAGE_SIZE = 25;

export const DROPDOWN_PAGE_SIZE = 500;

export type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type PaginationParams = {
    page?: number;
    page_size?: number;
};
