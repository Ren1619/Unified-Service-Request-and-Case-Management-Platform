import { Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import Heading from '@/components/heading';
import { EmptyState, TableSurface } from '@/components/module-surface';
import { PageHeader, PageShell } from '@/components/page-shell';
import { Badge } from '@/components/ui/badge';
import { outbox } from '@/routes/messages';

export default function MessagesOutbox() {
    return (
        <>
            <Head title="Outbox" />

            <PageShell>
                <PageHeader>
                <Heading
                    title="Outbox"
                    description="Queued, retrying, or failed outbound SMS messages."
                />
                </PageHeader>

                <TableSurface>
                    <table className="w-full min-w-[680px] text-sm">
                        <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">To</th>
                                <th className="px-4 py-3 font-medium">
                                    Message
                                </th>
                                <th className="hidden px-4 py-3 font-medium md:table-cell">
                                    Last attempt
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-4"
                                >
                                    <EmptyState
                                        icon={Mail}
                                        title="No queued messages"
                                        description="Queued, failed, or retrying messages will appear after messaging integration is enabled."
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </TableSurface>

                <Badge variant="outline">Gateway not connected</Badge>
            </PageShell>
        </>
    );
}

MessagesOutbox.layout = {
    breadcrumbs: [
        {
            title: 'Outbox',
            href: outbox(),
        },
    ],
};
