import { Card, CardContent } from '@/components/ui/card';

export function DataTableCard({ children }: { children: React.ReactNode }) {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-0">{children}</CardContent>
        </Card>
    );
}
