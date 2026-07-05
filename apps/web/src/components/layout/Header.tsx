'use client';

import { usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { getPageMeta } from '@/config/navigation';

export function Header() {
    const pathname = usePathname();
    const { title, description } = getPageMeta(pathname);

    return (
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-background px-8 py-6">
            <div className="space-y-2">
                <h1 className="font-serif text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
            </div>
            <ThemeToggle />
        </header>
    );
}
