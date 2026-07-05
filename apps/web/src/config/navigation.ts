import { ArrowLeftRight, Building2, LayoutDashboard, Target, Wallet, type LucideIcon } from 'lucide-react';

import { routes } from '@/config/routes';

export type NavItem = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
};

export const navigation: NavItem[] = [
    {
        title: 'Accounts',
        description: 'Track balances across your banks, cards, and wallets.',
        href: routes.accounts,
        icon: Wallet,
    },
    {
        title: 'Institutions',
        description: 'Manage the banks and providers your accounts belong to.',
        href: routes.institutions,
        icon: Building2,
    },
    {
        title: 'Transactions',
        description: 'Review income, spending, and transfers over time.',
        href: routes.transactions,
        icon: ArrowLeftRight,
    },
    {
        title: 'Goals',
        description: 'Set savings targets and follow your progress.',
        href: routes.goals,
        icon: Target,
    },
    {
        title: 'Dashboard',
        description: 'See your financial picture at a glance.',
        href: routes.dashboard,
        icon: LayoutDashboard,
    },
];

export function isActiveRoute(pathname: string, href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageMeta(pathname: string): { title: string; description: string } {
    const item = navigation.find(nav => isActiveRoute(pathname, nav.href));

    return {
        title: item?.title ?? 'LedgerDB',
        description: item?.description ?? 'Your personal finance workspace.',
    };
}

export function getPageTitle(pathname: string): string {
    return getPageMeta(pathname).title;
}
