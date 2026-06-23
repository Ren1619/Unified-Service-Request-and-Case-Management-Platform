import { Head, Link } from '@inertiajs/react';
import { Network } from 'lucide-react';
import Heading from '@/components/heading';
import { EmptyState } from '@/components/module-surface';
import { PageHeader, PageShell } from '@/components/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cluster, index, show } from '@/routes/groups';
import type { ContactGroup } from '@/types';

export default function GroupsCluster({ groups }: { groups: ContactGroup[] }) {
    return (
        <>
            <Head title="Cluster" />

            <PageShell>
                <PageHeader
                    actions={
                        <Button asChild variant="outline">
                            <Link href={index()}>Groups List</Link>
                        </Button>
                    }
                >
                    <Heading
                        title="Cluster"
                        description="View contacts grouped by operational cluster."
                    />
                </PageHeader>

                <div className="grid gap-4 lg:grid-cols-2">
                    {groups.map((group) => (
                        <section
                            key={group.id}
                            className="rounded-lg border bg-card p-4 shadow-xs"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-semibold">
                                        {group.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {group.description ??
                                            'No description provided.'}
                                    </p>
                                </div>
                                <Badge variant="outline">
                                    {group.contacts_count ?? 0} contacts
                                </Badge>
                            </div>

                            <div className="mt-4 space-y-2">
                                {(group.contacts ?? []).map((contact) => (
                                    <div
                                        key={contact.id}
                                        className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                                    >
                                        <span>{contact.name}</span>
                                        <span className="text-muted-foreground">
                                            {contact.mobile_number ??
                                                contact.email ??
                                                ''}
                                        </span>
                                    </div>
                                ))}
                                {(group.contacts ?? []).length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No contacts in this cluster.
                                    </p>
                                )}
                            </div>

                            <Button asChild variant="ghost" className="mt-4">
                                <Link href={show(group.id)}>
                                    <Network aria-hidden className="size-4" />
                                    View group
                                </Link>
                            </Button>
                        </section>
                    ))}
                </div>
                {groups.length === 0 && (
                    <div className="rounded-lg border bg-card shadow-xs">
                        <EmptyState
                            icon={Network}
                            title="No clusters available"
                            description="Create active contact groups to see operational clusters here."
                        />
                    </div>
                )}
            </PageShell>
        </>
    );
}

GroupsCluster.layout = {
    breadcrumbs: [
        { title: 'Groups', href: index() },
        { title: 'Cluster', href: cluster() },
    ],
};
