import Link from 'next/link';

import { DeleteInstitutionButton } from '@/components/institutions/DeleteInstitutionButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { routes } from '@/config/routes';
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
                            <div className="flex items-center justify-end gap-2">
                                <Link href={routes.institutionEdit(institution.id)} className="text-sm font-medium hover:underline">
                                    Edit
                                </Link>
                                <DeleteInstitutionButton id={institution.id} name={institution.name} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
