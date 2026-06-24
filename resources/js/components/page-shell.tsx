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
                'mx-auto flex w-full max-w-7xl flex-col gap-4 p-3 min-[360px]:gap-6 min-[360px]:p-4 sm:p-6 lg:p-8',
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
        <div className="flex min-w-0 flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">{children}</div>
            {actions && (
                <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    {actions}
                </div>
            )}
        </div>
    );
}
