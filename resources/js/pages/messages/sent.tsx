import { Head } from '@inertiajs/react';
import { Send } from 'lucide-react';
import Heading from '@/components/heading';
import { EmptyState, TableSurface } from '@/components/module-surface';
import { PageHeader, PageShell } from '@/components/page-shell';
import { Badge } from '@/components/ui/badge';
import { sent } from '@/routes/messages';

export default function SentMessages() {
    return (
        <>
            <Head title="Sent Messages" />

            <PageShell>
                <PageHeader>
                <Heading
                    title="Sent Messages"
                    description="Outbound SMS messages successfully accepted by the messaging gateway."
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
                                    Sent
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Gateway
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
                                        icon={Send}
                                        title="No sent messages"
                                        description="Sent message records will appear here once the messaging gateway is connected."
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </TableSurface>

                <Badge variant="outline">API pending</Badge>
            </PageShell>
        </>
    );
}

SentMessages.layout = {
    breadcrumbs: [
        {
            title: 'Sent Messages',
            href: sent(),
        },
    ],
};
