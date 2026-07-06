import type { Metadata } from 'next';
import { Eczar, Quicksand } from 'next/font/google';

import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeProvider } from '@/components/theme-provider';
import '../styles/globals.css';

const quicksand = Quicksand({
    variable: '--font-quicksand',
    subsets: ['latin'],
});

const eczar = Eczar({
    variable: '--font-eczar',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'LedgerDB',
    description: 'A modern personal finance tracker',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${quicksand.variable} ${eczar.variable} h-full antialiased`} suppressHydrationWarning>
            <body className="min-h-full flex flex-col">
                <ThemeProvider>
                    <AppLayout>{children}</AppLayout>
                </ThemeProvider>
            </body>
        </html>
    );
}
