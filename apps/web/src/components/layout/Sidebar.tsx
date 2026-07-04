'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navigation, isActiveRoute } from '@/config/navigation';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="flex h-14 items-center border-b border-sidebar-border px-4">
                <Link href={routes.home} className="text-base font-semibold tracking-tight">
                    LedgerDB
                </Link>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-3">
                {navigation.map(item => {
                    const isActive = isActiveRoute(pathname, item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground')}
                        >
                            <Icon className="size-4 shrink-0" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
