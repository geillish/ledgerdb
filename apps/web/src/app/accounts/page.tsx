import { Plus } from 'lucide-react';

import { getAccounts } from '@/actions/account';
import { AccountsEmpty } from '@/components/accounts/AccountsEmpty';
import { AccountTable } from '@/components/accounts/AccountTable';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';

export default async function AccountsPage() {
    const accounts = await getAccounts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{accounts.length === 0 ? 'No accounts to display' : `${accounts.length} account${accounts.length === 1 ? '' : 's'}`}</p>
                {accounts.length > 0 && (
                    <ButtonLink href={routes.accountsNew}>
                        <Plus className="size-4" />
                        Add account
                    </ButtonLink>
                )}
            </div>

            {accounts.length === 0 ? <AccountsEmpty /> : <AccountTable accounts={accounts} />}
        </div>
    );
}
