import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types';

function labelFor(link: PaginationLink) {
    if (link.label.includes('Previous')) {
        return <ChevronLeft aria-hidden className="size-4" />;
    }

    if (link.label.includes('Next')) {
        return <ChevronRight aria-hidden className="size-4" />;
    }

    return link.label;
}

export default function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center gap-2">
            {links.map((link, index) => (
                <Button
                    key={`${link.label}-${index}`}
                    asChild={Boolean(link.url)}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    aria-current={link.active ? 'page' : undefined}
                    aria-label={link.label
                        .replaceAll('&laquo;', '')
                        .replaceAll('&raquo;', '')}
                >
                    {link.url ? (
                        <Link href={link.url} preserveScroll preserveState>
                            {labelFor(link)}
                        </Link>
                    ) : (
                        <span>{labelFor(link)}</span>
                    )}
                </Button>
            ))}
        </nav>
    );
}
