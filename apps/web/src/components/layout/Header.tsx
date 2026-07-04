'use client';

import { usePathname } from 'next/navigation';

import { getPageTitle } from '@/config/navigation';

export function Header() {
    const pathname = usePathname();
    const title = getPageTitle(pathname);

    return (
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-6">
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        </header>
    );
}
