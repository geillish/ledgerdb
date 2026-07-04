export const routes = {
    home: '/',
    accounts: '/accounts',
    accountsNew: '/accounts/new',
    institutions: '/institutions',
    institutionsNew: '/institutions/new',
    institutionEdit: (id: string) => `/institutions/${id}/edit`,
    transactions: '/transactions',
    goals: '/goals',
    dashboard: '/dashboard',
} as const;
