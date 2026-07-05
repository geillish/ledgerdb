import type { Metadata } from 'next';
import { Eczar, Nunito, Quicksand, Special_Elite } from 'next/font/google';

import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeProvider } from '@/components/theme-provider';
import '../styles/globals.css';

const quicksand = Quicksand({
    variable: '--font-quicksand',
    subsets: ['latin'],
});

const nunito = Nunito({
    variable: '--font-nunito',
    subsets: ['latin'],
});

const eczar = Eczar({
    variable: '--font-eczar',
    subsets: ['latin'],
});

const specialElite = Special_Elite({
    weight: '400',
    variable: '--font-special-elite',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'LedgerDB',
    description: 'A modern personal finance tracker',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${quicksand.variable} ${nunito.variable} ${eczar.variable} ${specialElite.variable} h-full antialiased`} suppressHydrationWarning>
            <body className="min-h-full flex flex-col">
                <ThemeProvider>
                    <AppLayout>{children}</AppLayout>
                </ThemeProvider>
            </body>
        </html>
    );
}
