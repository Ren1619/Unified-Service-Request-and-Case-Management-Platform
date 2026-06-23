import { Head, Link, router } from '@inertiajs/react';
import { Eye, Map, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import {
    EmptyState,
    FilterBar,
    TableSurface,
} from '@/components/module-surface';
import NativeSelect from '@/components/native-select';
import { PageHeader, PageShell } from '@/components/page-shell';
import Pagination from '@/components/pagination';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { create, destroy, edit, index, show } from '@/routes/regions';
import type { Paginated, Region } from '@/types';

type RegionsIndexProps = {
    regions: Paginated<Region>;
    filters: {
        search?: string | null;
        status?: string | null;
    };
    can: {
        create: boolean;
    };
};

export default function RegionsIndex({
    regions,
    filters,
    can,
}: RegionsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            index().url,
            { search, status },
            { preserveState: true, replace: true },
        );
    }

    function archive(region: Region) {
        if (!window.confirm(`Archive ${region.name}?`)) {
            return;
        }

        router.delete(destroy(region.id).url, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Regions" />

            <PageShell>
                <PageHeader
                    actions={
                        can.create && (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus aria-hidden className="size-4" />
                                    New region
                                </Link>
                            </Button>
                        )
                    }
                >
                    <Heading
                        title="Regions"
                        description="Manage service office regions and routing availability."
                    />
                </PageHeader>

                <FilterBar>
                    <form
                        onSubmit={submit}
                        className="flex flex-col gap-3 md:flex-row md:items-center"
                    >
                        <div className="relative md:w-80">
                            <Search
                                aria-hidden
                                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search regions"
                                className="pl-9"
                            />
                        </div>

                        <NativeSelect
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="md:w-44"
                        >
                            <option value="">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </NativeSelect>

                        <Button type="submit" variant="outline">
                            <Search aria-hidden className="size-4" />
                            Search
                        </Button>
                    </form>
                </FilterBar>

                <TableSurface>
                    <table className="w-full min-w-[720px] text-sm">
                        <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="hidden px-4 py-3 font-medium lg:table-cell">
                                    Description
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="w-32 px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {regions.data.map((region) => (
                                <tr
                                    key={region.id}
                                    className="border-t transition-colors hover:bg-muted/35"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {region.code}
                                    </td>
                                    <td className="px-4 py-3">{region.name}</td>
                                    <td className="hidden max-w-xl truncate px-4 py-3 text-muted-foreground lg:table-cell">
                                        {region.description ?? ''}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge
                                            active={region.is_active}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={show(region.id)}
                                                    aria-label={`View ${region.name}`}
                                                >
                                                    <Eye
                                                        aria-hidden
                                                        className="size-4"
                                                    />
                                                </Link>
                                            </Button>
                                            {can.create && (
                                                <>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Link
                                                            href={edit(
                                                                region.id,
                                                            )}
                                                            aria-label={`Edit ${region.name}`}
                                                        >
                                                            <Pencil
                                                                aria-hidden
                                                                className="size-4"
                                                            />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            archive(region)
                                                        }
                                                        aria-label={`Archive ${region.name}`}
                                                    >
                                                        <Trash2
                                                            aria-hidden
                                                            className="size-4"
                                                        />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {regions.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-4"
                                    >
                                        <EmptyState
                                            icon={Map}
                                            title="No regions found"
                                            description="Create regions to support complaint routing, assignment, and service office coverage."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableSurface>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {regions.from ?? 0} to {regions.to ?? 0} of{' '}
                        {regions.total}
                    </p>
                    <Pagination links={regions.links} />
                </div>
            </PageShell>
        </>
    );
}

RegionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Regions',
            href: index(),
        },
    ],
};
