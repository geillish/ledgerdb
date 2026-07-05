import { getAccounts } from '@/actions/account';
import { getInstitutions } from '@/actions/institution';
import { AccountsEmpty } from '@/components/accounts/AccountsEmpty';
import { AccountTable } from '@/components/accounts/AccountTable';
import { CreateAccountDialog } from '@/components/accounts/CreateAccountDialog';

export default async function AccountsPage() {
    const [accounts, institutions] = await Promise.all([getAccounts(), getInstitutions()]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{accounts.length === 0 ? 'No accounts to display' : `${accounts.length} account${accounts.length === 1 ? '' : 's'}`}</p>
                <CreateAccountDialog institutions={institutions} />
            </div>

            {accounts.length === 0 ? <AccountsEmpty institutions={institutions} /> : <AccountTable accounts={accounts} institutions={institutions} />}
        </div>
    );
}
