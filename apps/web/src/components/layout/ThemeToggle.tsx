'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
    showLabel?: boolean;
    className?: string;
};

export function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Button type="button" variant="outline" size={showLabel ? 'sm' : 'icon-sm'} className={cn(showLabel && 'w-full justify-start gap-2', className)} aria-label="Toggle theme" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
            <SunIcon className="hidden dark:block" />
            <MoonIcon className="dark:hidden" />
            {showLabel ? (
                <>
                    <span className="hidden dark:inline">Light mode</span>
                    <span className="dark:hidden">Dark mode</span>
                </>
            ) : null}
        </Button>
    );
}
