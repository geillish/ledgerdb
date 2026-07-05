import { InstitutionRowActions } from '@/components/institutions/InstitutionRowActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import type { Institution } from '@/types/institution';

export function InstitutionTable({ institutions }: { institutions: Institution[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {institutions.map(institution => (
                    <TableRow key={institution.id}>
                        <TableCell className="font-medium">{institution.name}</TableCell>
                        <TableCell>{formatDate(institution.date_created)}</TableCell>
                        <TableCell className="text-right">
                            <InstitutionRowActions id={institution.id} name={institution.name} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
