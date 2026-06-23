import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageShell({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function PageHeader({
    actions,
    children,
}: {
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
            {children}
            {actions && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {actions}
                </div>
            )}
        </div>
    );
}
