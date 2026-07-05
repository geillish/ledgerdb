import { notFound } from 'next/navigation';

import { getInstitution } from '@/actions/institution';
import { InstitutionForm } from '@/components/institutions/InstitutionForm';

type EditInstitutionPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditInstitutionPage({ params }: EditInstitutionPageProps) {
    const { id } = await params;

    try {
        const institution = await getInstitution(id);
        return <InstitutionForm institution={institution} />;
    } catch {
        notFound();
    }
}
