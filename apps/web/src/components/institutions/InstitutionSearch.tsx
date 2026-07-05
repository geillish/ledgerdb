import { Input } from '@/components/ui/input';

export function InstitutionSearch({ query }: { query?: string }) {
    return (
        <form method="get" className="flex max-w-sm gap-2">
            <Input name="search" defaultValue={query ?? ''} placeholder="Search by name..." />
        </form>
    );
}
