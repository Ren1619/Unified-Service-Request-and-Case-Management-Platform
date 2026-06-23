import { Head, Link, router } from '@inertiajs/react';
import { Eye, ListChecks, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
import { create, destroy, edit, index, show } from '@/routes/complaint-types';
import type { ComplaintType, Paginated } from '@/types';

type ComplaintTypesIndexProps = {
    complaintTypes: Paginated<ComplaintType>;
    filters: {
        search?: string | null;
        status?: string | null;
    };
    can: {
        create: boolean;
    };
};

export default function ComplaintTypesIndex({
    complaintTypes,
    filters,
    can,
}: ComplaintTypesIndexProps) {
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

    function archive(complaintType: ComplaintType) {
        if (!window.confirm(`Archive ${complaintType.name}?`)) {
            return;
        }

        router.delete(destroy(complaintType.id).url, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Complaint types" />

            <PageShell>
                <PageHeader
                    actions={
                        can.create && (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus aria-hidden className="size-4" />
                                    New complaint type
                                </Link>
                            </Button>
                        )
                    }
                >
                    <Heading
                        title="Complaint types"
                        description="Manage categories used to classify incoming complaints and service requests."
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
                                placeholder="Search complaint types"
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
                    <table className="w-full min-w-[680px] text-sm">
                        <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                            <tr>
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
                            {complaintTypes.data.map((complaintType) => (
                                <tr
                                    key={complaintType.id}
                                    className="border-t transition-colors hover:bg-muted/35"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {complaintType.name}
                                    </td>
                                    <td className="hidden max-w-xl truncate px-4 py-3 text-muted-foreground lg:table-cell">
                                        {complaintType.description ?? ''}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge
                                            active={complaintType.is_active}
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
                                                    href={show(
                                                        complaintType.id,
                                                    )}
                                                    aria-label={`View ${complaintType.name}`}
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
                                                                complaintType.id,
                                                            )}
                                                            aria-label={`Edit ${complaintType.name}`}
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
                                                            archive(
                                                                complaintType,
                                                            )
                                                        }
                                                        aria-label={`Archive ${complaintType.name}`}
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
                            {complaintTypes.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-4"
                                    >
                                        <EmptyState
                                            icon={ListChecks}
                                            title="No complaint types found"
                                            description="Create complaint categories so operators can classify incoming reports consistently."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableSurface>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {complaintTypes.from ?? 0} to{' '}
                        {complaintTypes.to ?? 0} of {complaintTypes.total}
                    </p>
                    <Pagination links={complaintTypes.links} />
                </div>
            </PageShell>
        </>
    );
}

ComplaintTypesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Complaint types',
            href: index(),
        },
    ],
};
