import { getInstitutions } from '@/actions/institution';
import { AccountForm } from '@/components/accounts/AccountForm';

export default async function NewAccountPage() {
    const institutions = await getInstitutions();

    return <AccountForm institutions={institutions} />;
}
