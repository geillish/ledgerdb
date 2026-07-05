import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';

export default function EditInstitutionPage() {
    redirect(routes.institutions);
}
