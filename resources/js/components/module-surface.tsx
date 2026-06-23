import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function FilterBar({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'rounded-lg border bg-card p-3 shadow-xs sm:p-4',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function TableSurface({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-lg border bg-card shadow-xs',
                className,
            )}
        >
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
}

export function EmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon aria-hidden className="size-5" />
            </div>
            <div className="space-y-1">
                <p className="font-medium">{title}</p>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}

export function MetricCard({
    label,
    value,
    detail,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    detail?: string;
    icon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}) {
    return (
        <div className="rounded-lg border bg-card p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                        {typeof value === 'number'
                            ? value.toLocaleString()
                            : value}
                    </p>
                </div>
                {Icon && (
                    <Icon
                        aria-hidden
                        className="mt-0.5 size-5 text-muted-foreground"
                    />
                )}
            </div>
            {detail && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {detail}
                </p>
            )}
        </div>
    );
}
