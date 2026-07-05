'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
    showLabel?: boolean;
    className?: string;
};

export function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && resolvedTheme === 'dark';
    const label = isDark ? 'Light mode' : 'Dark mode';
    const Icon = isDark ? SunIcon : MoonIcon;

    return (
        <Button type="button" variant="outline" size={showLabel ? 'sm' : 'icon-sm'} className={cn(showLabel && 'w-full justify-start gap-2', className)} aria-label="Toggle theme" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            <Icon />
            {showLabel ? <span>{label}</span> : null}
        </Button>
    );
}
