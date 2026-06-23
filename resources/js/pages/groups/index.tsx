import { Head, Link, router } from '@inertiajs/react';
import { Eye, Network, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
import { create, destroy, edit, index, show } from '@/routes/groups';
import { cluster } from '@/routes/groups';
import type { ContactGroup, Paginated } from '@/types';

type GroupsIndexProps = {
    groups: Paginated<ContactGroup>;
    filters: {
        search?: string | null;
        status?: string | null;
    };
    can: {
        create: boolean;
    };
};

export default function GroupsIndex({
    groups,
    filters,
    can,
}: GroupsIndexProps) {
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

    function archive(group: ContactGroup) {
        if (!window.confirm(`Archive ${group.name}?`)) {
            return;
        }

        router.delete(destroy(group.id).url, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Groups" />

            <PageShell>
                <PageHeader
                    actions={
                        <>
                            <Button asChild variant="outline">
                                <Link href={cluster()}>
                                    <Network aria-hidden className="size-4" />
                                    Cluster
                                </Link>
                            </Button>
                            {can.create && (
                                <Button asChild>
                                    <Link href={create()}>
                                        <Plus aria-hidden className="size-4" />
                                        Add New Group
                                    </Link>
                                </Button>
                            )}
                        </>
                    }
                >
                    <Heading
                        title="Groups List"
                        description="Manage contact groups for messaging and coordination."
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
                                placeholder="Search groups"
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
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="hidden px-4 py-3 font-medium lg:table-cell">
                                    Description
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Contacts
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
                            {groups.data.map((group) => (
                                <tr
                                    key={group.id}
                                    className="border-t transition-colors hover:bg-muted/35"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {group.name}
                                    </td>
                                    <td className="hidden max-w-xl truncate px-4 py-3 text-muted-foreground lg:table-cell">
                                        {group.description ?? ''}
                                    </td>
                                    <td className="px-4 py-3">
                                        {group.contacts_count ?? 0}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge active={group.is_active} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={show(group.id)}
                                                    aria-label={`View ${group.name}`}
                                                >
                                                    <Eye
                                                        aria-hidden
                                                        className="size-4"
                                                    />
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={edit(group.id)}
                                                    aria-label={`Edit ${group.name}`}
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
                                                onClick={() => archive(group)}
                                                aria-label={`Archive ${group.name}`}
                                            >
                                                <Trash2
                                                    aria-hidden
                                                    className="size-4"
                                                />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {groups.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-4"
                                    >
                                        <EmptyState
                                            icon={Network}
                                            title="No groups found"
                                            description="Create groups to coordinate SMS recipients by team, office, or response cluster."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableSurface>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {groups.from ?? 0} to {groups.to ?? 0} of{' '}
                        {groups.total}
                    </p>
                    <Pagination links={groups.links} />
                </div>
            </PageShell>
        </>
    );
}

GroupsIndex.layout = {
    breadcrumbs: [{ title: 'Groups', href: index() }],
};
