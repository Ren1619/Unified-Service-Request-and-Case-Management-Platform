import { Head } from '@inertiajs/react';
import { Inbox } from 'lucide-react';
import Heading from '@/components/heading';
import { TableSurface } from '@/components/module-surface';
import { PageHeader, PageShell } from '@/components/page-shell';
import { Badge } from '@/components/ui/badge';
import { inbox } from '@/routes/messages';

const rows = [
    {
        from: '+63 917 000 1200',
        message: 'Follow up on submitted request.',
        received: 'Pending API',
        status: 'Unread',
    },
];

export default function MessagesInbox() {
    return (
        <>
            <Head title="Inbox" />

            <PageShell>
                <PageHeader>
                <Heading
                    title="Inbox"
                    description="Incoming SMS messages received from citizens and contacts."
                />
                </PageHeader>

                <TableSurface>
                    <table className="w-full min-w-[680px] text-sm">
                        <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">From</th>
                                <th className="px-4 py-3 font-medium">
                                    Message
                                </th>
                                <th className="hidden px-4 py-3 font-medium md:table-cell">
                                    Received
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.from}
                                    className="border-t transition-colors hover:bg-muted/35"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {row.from}
                                    </td>
                                    <td className="px-4 py-3">{row.message}</td>
                                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                                        {row.received}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline">
                                            {row.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableSurface>

                <div className="flex items-start gap-3 rounded-lg border bg-card p-4 text-sm shadow-xs">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Inbox aria-hidden className="size-4" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium">Messaging API pending</p>
                        <p className="leading-6 text-muted-foreground">
                            Live inbox data will appear here once the messaging
                            API is connected.
                        </p>
                    </div>
                </div>
            </PageShell>
        </>
    );
}

MessagesInbox.layout = {
    breadcrumbs: [
        {
            title: 'Inbox',
            href: inbox(),
        },
    ],
};
