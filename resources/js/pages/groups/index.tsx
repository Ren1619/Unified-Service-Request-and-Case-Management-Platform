import { Head, Link, router } from '@inertiajs/react';
import {
    Eye,
    MoreHorizontal,
    Network,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import {
    EmptyState,
    MobileCardList,
    MobileRecordCard,
    MobileRecordDetail,
    ResponsiveFilterBar,
    TableSurface,
} from '@/components/module-surface';
import NativeSelect from '@/components/native-select';
import { PageHeader, PageShell } from '@/components/page-shell';
import Pagination from '@/components/pagination';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { destroy, edit, index, show } from '@/routes/groups';
import { cluster } from '@/routes/groups';
import type { Contact, ContactGroup, Paginated } from '@/types';
import GroupForm from './group-form';

type GroupsIndexProps = {
    groups: Paginated<ContactGroup>;
    filters: {
        search?: string | null;
        status?: string | null;
    };
    can: {
        create: boolean;
    };
    contacts: Contact[];
};

export default function GroupsIndex({
    groups,
    filters,
    can,
    contacts,
}: GroupsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [openGroupId, setOpenGroupId] = useState<number | null>(null);
    const filterFormId = 'groups-filters';

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

    function resetFilters() {
        setSearch('');
        setStatus('');
        router.get(index().url, {}, { preserveState: true, replace: true });
    }

    function GroupActions({ group }: { group: ContactGroup }) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Open actions for ${group.name}`}
                    >
                        <MoreHorizontal aria-hidden className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem asChild>
                        <Link href={show(group.id)}>
                            <Eye aria-hidden className="size-4" />
                            View
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={edit(group.id)}>
                            <Pencil aria-hidden className="size-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => archive(group)}
                    >
                        <Trash2 aria-hidden className="size-4" />
                        Archive
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
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
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus
                                                aria-hidden
                                                className="size-4"
                                            />
                                            Add New Group
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-5xl">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Add New Group
                                            </DialogTitle>
                                            <DialogDescription>
                                                Create a contact group for
                                                messaging and coordination.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <GroupForm
                                            contacts={contacts}
                                            redirectTo="index"
                                        />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </>
                    }
                >
                    <Heading
                        title="Groups List"
                        description="Manage contact groups for messaging and coordination."
                    />
                </PageHeader>

                <ResponsiveFilterBar
                    formId={filterFormId}
                    onReset={resetFilters}
                    title="Filter groups"
                >
                    <form
                        id={filterFormId}
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

                        <Button
                            type="submit"
                            variant="outline"
                            className="hidden md:inline-flex"
                        >
                            <Search aria-hidden className="size-4" />
                            Search
                        </Button>
                    </form>
                </ResponsiveFilterBar>

                <TableSurface className="hidden md:block">
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
                                    <td colSpan={5} className="px-4 py-4">
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

                <MobileCardList>
                    {groups.data.map((group) => (
                        <MobileRecordCard
                            key={group.id}
                            actions={<GroupActions group={group} />}
                            badges={<StatusBadge active={group.is_active} />}
                            description={group.description ?? 'No description'}
                            isOpen={openGroupId === group.id}
                            onOpenChange={(open) =>
                                setOpenGroupId(open ? group.id : null)
                            }
                            title={group.name}
                        >
                            <MobileRecordDetail label="Contacts">
                                {group.contacts_count ?? 0}
                            </MobileRecordDetail>
                            <MobileRecordDetail label="Description">
                                {group.description ?? 'No description'}
                            </MobileRecordDetail>
                            <MobileRecordDetail label="Status">
                                <StatusBadge active={group.is_active} />
                            </MobileRecordDetail>
                        </MobileRecordCard>
                    ))}
                    {groups.data.length === 0 && (
                        <EmptyState
                            icon={Network}
                            title="No groups found"
                            description="Create groups to coordinate SMS recipients by team, office, or response cluster."
                        />
                    )}
                </MobileCardList>

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
