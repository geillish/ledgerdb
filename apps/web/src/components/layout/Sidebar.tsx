'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navigation, isActiveRoute } from '@/config/navigation';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="border-b border-sidebar-border px-4 py-5">
                <div className="border-l-2 border-l-sidebar-primary pl-3">
                    <Link href={routes.home} className="font-serif text-xl font-semibold tracking-tight">
                        LedgerDB
                    </Link>
                    <p className="mt-1 text-xs text-sidebar-foreground/60">Personal finance</p>
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-3">
                {navigation.map(item => {
                    const isActive = isActiveRoute(pathname, item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg border-l-2 py-2.5 pr-3 pl-[10px] text-sm font-medium transition-colors',
                                isActive ? 'border-l-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground' : 'border-l-transparent text-sidebar-foreground/75 hover:border-l-sidebar-primary/30 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                            )}
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
