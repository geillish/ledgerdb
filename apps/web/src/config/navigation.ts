import {
  ArrowLeftRight,
  Building2,
  LayoutDashboard,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { routes } from "@/config/routes";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navigation: NavItem[] = [
  { title: "Accounts", href: routes.accounts, icon: Wallet },
  { title: "Institutions", href: routes.institutions, icon: Building2 },
  { title: "Transactions", href: routes.transactions, icon: ArrowLeftRight },
  { title: "Goals", href: routes.goals, icon: Target },
  { title: "Dashboard", href: routes.dashboard, icon: LayoutDashboard },
];

export function getPageTitle(pathname: string): string {
  const item = navigation.find(
    (nav) => pathname === nav.href || pathname.startsWith(`${nav.href}/`),
  );

  return item?.title ?? "LedgerDB";
}
