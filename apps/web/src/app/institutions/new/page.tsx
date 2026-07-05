import { redirect } from 'next/navigation';

import { routes } from '@/config/routes';

export default function NewInstitutionPage() {
    redirect(routes.institutions);
}
