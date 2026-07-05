import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-28" />
            </div>
            <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-foreground/10">
                <div className="flex gap-8 border-b px-4 py-3.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="ml-auto h-4 w-14" />
                </div>
                {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="flex gap-8 border-b px-4 py-3.5 last:border-b-0">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-20 rounded-4xl" />
                        <Skeleton className="ml-auto h-4 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}
