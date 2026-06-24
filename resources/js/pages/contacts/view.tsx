import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import StatusBadge from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/contacts';
import type { Contact } from '@/types';

export default function ContactsView({
    contact,
    can,
}: {
    contact: Contact;
    can: { update: boolean };
}) {
    return (
        <>
            <Head title={contact.name} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <Heading
                        title={contact.name}
                        description="Contact details and group membership."
                    />

                    {can.update && (
                        <Button asChild>
                            <Link href={edit(contact.id)}>
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
                            <StatusBadge active={contact.is_active} />
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Mobile
                        </dt>
                        <dd className="mt-1">{contact.mobile_number ?? ''}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Phone
                        </dt>
                        <dd className="mt-1">{contact.phone_number ?? ''}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Email
                        </dt>
                        <dd className="mt-1">{contact.email ?? ''}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Organization
                        </dt>
                        <dd className="mt-1">{contact.organization ?? ''}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Position
                        </dt>
                        <dd className="mt-1">{contact.position ?? ''}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Region
                        </dt>
                        <dd className="mt-1">
                            {contact.region
                                ? `${contact.region.code} - ${contact.region.name}`
                                : 'No region assigned'}
                        </dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm text-muted-foreground">
                            Groups
                        </dt>
                        <dd className="mt-1">
                            {contact.groups
                                ?.map((group) => group.name)
                                .join(', ') || 'No groups'}
                        </dd>
                    </div>
                    <div className="md:col-span-2">
                        <dt className="text-sm text-muted-foreground">
                            Notes
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap">
                            {contact.notes ?? 'No notes provided.'}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    );
}

ContactsView.layout = (props: { contact: Contact }) => ({
    breadcrumbs: [
        { title: 'Contacts', href: index() },
        { title: props.contact.name, href: show(props.contact.id) },
    ],
});
