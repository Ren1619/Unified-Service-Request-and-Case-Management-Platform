import { Head, Link, router } from '@inertiajs/react';
import {
    Contact as ContactIcon,
    Eye,
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
    FilterBar,
    TableSurface,
} from '@/components/module-surface';
import NativeSelect from '@/components/native-select';
import { PageHeader, PageShell } from '@/components/page-shell';
import Pagination from '@/components/pagination';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { create, destroy, edit, index, show } from '@/routes/contacts';
import type { Contact, ContactGroupSummary, Paginated } from '@/types';

type ContactsIndexProps = {
    contacts: Paginated<Contact>;
    filters: {
        search?: string | null;
        status?: string | null;
        group_id?: string | null;
    };
    groups: ContactGroupSummary[];
    can: {
        create: boolean;
    };
};

export default function ContactsIndex({
    contacts,
    filters,
    groups,
    can,
}: ContactsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [groupId, setGroupId] = useState(filters.group_id ?? '');

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            index().url,
            { search, status, group_id: groupId },
            { preserveState: true, replace: true },
        );
    }

    function archive(contact: Contact) {
        if (!window.confirm(`Archive ${contact.name}?`)) {
            return;
        }

        router.delete(destroy(contact.id).url, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Contacts" />

            <PageShell>
                <PageHeader
                    actions={
                        can.create && (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus aria-hidden className="size-4" />
                                    Add New Contact
                                </Link>
                            </Button>
                        )
                    }
                >
                    <Heading
                        title="Contact List"
                        description="Manage contacts used for SMS, calls, and group routing."
                    />
                </PageHeader>

                <FilterBar>
                    <form
                        onSubmit={submit}
                        className="grid gap-3 md:grid-cols-4"
                    >
                        <div className="relative md:col-span-2">
                            <Search
                                aria-hidden
                                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search contacts"
                                className="pl-9"
                            />
                        </div>
                        <NativeSelect
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                        >
                            <option value="">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </NativeSelect>
                        <NativeSelect
                            value={groupId}
                            onChange={(event) => setGroupId(event.target.value)}
                        >
                            <option value="">All groups</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </NativeSelect>
                        <Button type="submit" variant="outline">
                            <Search aria-hidden className="size-4" />
                            Search
                        </Button>
                    </form>
                </FilterBar>

                <TableSurface>
                    <table className="w-full min-w-[760px] text-sm">
                        <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="hidden px-4 py-3 font-medium lg:table-cell">
                                    Contact
                                </th>
                                <th className="hidden px-4 py-3 font-medium xl:table-cell">
                                    Groups
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
                            {contacts.data.map((contact) => (
                                <tr
                                    key={contact.id}
                                    className="border-t transition-colors hover:bg-muted/35"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {contact.name}
                                        <div className="text-xs font-normal text-muted-foreground lg:hidden">
                                            {contact.mobile_number ??
                                                contact.email ??
                                                ''}
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 lg:table-cell">
                                        <div>{contact.mobile_number}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {contact.email}
                                        </div>
                                    </td>
                                    <td className="hidden max-w-sm px-4 py-3 text-muted-foreground xl:table-cell">
                                        {contact.groups
                                            ?.map((group) => group.name)
                                            .join(', ') || 'No groups'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge
                                            active={contact.is_active}
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
                                                    href={show(contact.id)}
                                                    aria-label={`View ${contact.name}`}
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
                                                    href={edit(contact.id)}
                                                    aria-label={`Edit ${contact.name}`}
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
                                                onClick={() => archive(contact)}
                                                aria-label={`Archive ${contact.name}`}
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
                            {contacts.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-4"
                                    >
                                        <EmptyState
                                            icon={ContactIcon}
                                            title="No contacts found"
                                            description="Add contacts for citizens, offices, partner organizations, and SMS groups."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableSurface>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {contacts.from ?? 0} to {contacts.to ?? 0} of{' '}
                        {contacts.total}
                    </p>
                    <Pagination links={contacts.links} />
                </div>
            </PageShell>
        </>
    );
}

ContactsIndex.layout = {
    breadcrumbs: [{ title: 'Contacts', href: index() }],
};
