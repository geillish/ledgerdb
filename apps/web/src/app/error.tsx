'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="mx-auto flex max-w-lg flex-col gap-4 py-12">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">The page could not be loaded. Check that the API is running and try again.</p>
            <Button className="w-fit" onClick={reset}>
                Try again
            </Button>
        </div>
    );
}

export default ErrorPage;
