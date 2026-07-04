import { ArrowLeftRight, Building2, LayoutDashboard, Target, Wallet, type LucideIcon } from 'lucide-react';

import { routes } from '@/config/routes';

export type NavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
};

export const navigation: NavItem[] = [
    { title: 'Accounts', href: routes.accounts, icon: Wallet },
    { title: 'Institutions', href: routes.institutions, icon: Building2 },
    { title: 'Transactions', href: routes.transactions, icon: ArrowLeftRight },
    { title: 'Goals', href: routes.goals, icon: Target },
    { title: 'Dashboard', href: routes.dashboard, icon: LayoutDashboard },
];

export function isActiveRoute(pathname: string, href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string): string {
    const item = navigation.find(nav => isActiveRoute(pathname, nav.href));

    return item?.title ?? 'LedgerDB';
}
