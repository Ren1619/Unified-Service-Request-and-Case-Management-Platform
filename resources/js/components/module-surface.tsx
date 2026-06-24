import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
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

export function ResponsiveFilterBar({
    children,
    description = 'Refine the list using the available filters.',
    formId,
    onReset,
    title = 'Filters',
}: {
    children: ReactNode;
    description?: string;
    formId: string;
    onReset: () => void;
    title?: string;
}) {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);

    if (!isMobile) {
        return <FilterBar>{children}</FilterBar>;
    }

    function resetFilters() {
        onReset();
        setOpen(false);
    }

    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button type="button" variant="outline" className="w-full">
                        <SlidersHorizontal aria-hidden className="size-4" />
                        Filter
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    className="w-3/4 max-w-none min-w-0 gap-0 p-0"
                >
                    <SheetHeader className="border-b p-3 pr-12 min-[360px]:p-4 min-[360px]:pr-12">
                        <SheetTitle>{title}</SheetTitle>
                        <SheetDescription>{description}</SheetDescription>
                    </SheetHeader>

                    <div
                        className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3 min-[360px]:p-4"
                        onSubmitCapture={() => setOpen(false)}
                    >
                        {children}
                    </div>

                    <SheetFooter className="border-t p-3 min-[360px]:p-4">
                        <Button
                            type="submit"
                            form={formId}
                            onClick={() => setOpen(false)}
                        >
                            Apply Filters
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </Button>
                        <SheetClose asChild>
                            <Button type="button" variant="ghost">
                                Close
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export function MobileCardList({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('space-y-3 md:hidden', className)}>{children}</div>
    );
}

export function MobileRecordCard({
    actions,
    badges,
    children,
    description,
    isOpen,
    onOpenChange,
    title,
}: {
    actions?: ReactNode;
    badges?: ReactNode;
    children: ReactNode;
    description?: ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
}) {
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={onOpenChange}
            className="rounded-lg border bg-card shadow-xs"
        >
            <div className="p-3 min-[360px]:p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                        <div className="truncate text-sm font-medium">
                            {title}
                        </div>
                        {description && (
                            <div className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                                {description}
                            </div>
                        )}
                    </div>
                    {actions && <div className="shrink-0">{actions}</div>}
                </div>

                {badges && (
                    <div className="mt-3 flex flex-wrap gap-2">{badges}</div>
                )}

                <CollapsibleTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-3 w-full justify-between px-2"
                    >
                        Details
                        <ChevronDown
                            aria-hidden
                            className={cn(
                                'size-4 transition-transform',
                                isOpen && 'rotate-180',
                            )}
                        />
                    </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="mt-3 grid gap-3 border-t pt-3">
                        {children}
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}

export function MobileRecordDetail({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-1 text-sm">
            <div className="text-xs font-medium text-muted-foreground">
                {label}
            </div>
            <div className="break-words text-foreground">{children}</div>
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
            <div className="overflow-x-auto overscroll-x-contain">
                {children}
            </div>
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
        <div className="flex flex-col items-center justify-center gap-3 px-3 py-8 text-center min-[360px]:px-4 min-[360px]:py-10">
            <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground min-[360px]:size-10">
                <Icon aria-hidden className="size-5" />
            </div>
            <div className="space-y-1">
                <p className="break-words font-medium">{title}</p>
                <p className="max-w-md break-words text-sm leading-6 text-muted-foreground">
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
        <div className="min-w-0 rounded-lg border bg-card p-3 shadow-xs min-[360px]:p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="break-words text-sm text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-1 break-words text-xl font-semibold tracking-tight min-[360px]:text-2xl">
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
                <p className="mt-3 break-words text-xs leading-5 text-muted-foreground">
                    {detail}
                </p>
            )}
        </div>
    );
}
