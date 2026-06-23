import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/groups';
import type { ContactGroup } from '@/types';

export default function GroupsView({
    group,
    can,
}: {
    group: ContactGroup;
    can: { update: boolean };
}) {
    return (
        <>
            <Head title={group.name} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <Heading
                        title={group.name}
                        description="Group details and assigned contacts."
                    />

                    {can.update && (
                        <Button asChild>
                            <Link href={edit(group.id)}>
                                <Pencil aria-hidden className="size-4" />
                                Edit
                            </Link>
                        </Button>
                    )}
                </div>

                <dl className="grid max-w-5xl gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Status
                        </dt>
                        <dd className="mt-1">
                            <StatusBadge active={group.is_active} />
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Contacts
                        </dt>
                        <dd className="mt-1 font-medium">
                            {group.contacts_count ?? group.contacts?.length ?? 0}
                        </dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm text-muted-foreground">
                            Description
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap">
                            {group.description ?? 'No description provided.'}
                        </dd>
                    </div>
                </dl>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">
                                    Mobile
                                </th>
                                <th className="hidden px-4 py-3 font-medium md:table-cell">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(group.contacts ?? []).map((contact) => (
                                <tr key={contact.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {contact.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {contact.mobile_number}
                                    </td>
                                    <td className="hidden px-4 py-3 md:table-cell">
                                        {contact.email}
                                    </td>
                                </tr>
                            ))}
                            {(group.contacts ?? []).length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        This group has no contacts yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

GroupsView.layout = ({ props }: { props: { group: ContactGroup } }) => ({
    breadcrumbs: [
        { title: 'Groups', href: index() },
        { title: props.group.name, href: show(props.group.id) },
    ],
});
