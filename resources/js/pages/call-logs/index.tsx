import { Head } from '@inertiajs/react';
import { Phone, PhoneCall, PhoneMissed, TimerOff } from 'lucide-react';
import Heading from '@/components/heading';
import {
    EmptyState,
    MetricCard,
    TableSurface,
} from '@/components/module-surface';
import { PageHeader, PageShell } from '@/components/page-shell';
import { Badge } from '@/components/ui/badge';
import { index } from '@/routes/call-logs';

export default function CallLogsIndex() {
    return (
        <>
            <Head title="Call Logs" />

            <PageShell>
                <PageHeader>
                <Heading
                    title="Call Logs"
                    description="Record operator pickup, call end time, duration, and caller context."
                />
                </PageHeader>

                <div className="grid gap-4 md:grid-cols-3">
                    <MetricCard label="Picked up" value={0} icon={PhoneCall} />
                    <MetricCard label="Ended" value={0} icon={TimerOff} />
                    <MetricCard label="Missed" value={0} icon={PhoneMissed} />
                </div>

                <TableSurface>
                    <table className="w-full min-w-[760px] text-sm">
                        <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    Caller
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Operator
                                </th>
                                <th className="hidden px-4 py-3 font-medium md:table-cell">
                                    Picked up
                                </th>
                                <th className="hidden px-4 py-3 font-medium md:table-cell">
                                    Ended
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-4"
                                >
                                    <EmptyState
                                        icon={Phone}
                                        title="No call records yet"
                                        description="Call records will be stored here once the call API posts pickup and ended events."
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </TableSurface>

                <div className="flex items-start gap-3 rounded-lg border bg-card p-4 text-sm shadow-xs">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Phone aria-hidden className="size-4" />
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium">Call API pending</p>
                        <p className="leading-6 text-muted-foreground">
                            Expected API fields: caller number, operator,
                            picked-up timestamp, ended timestamp, duration,
                            status, and notes.
                        </p>
                        <Badge variant="outline">API pending</Badge>
                    </div>
                </div>
            </PageShell>
        </>
    );
}

CallLogsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Call Logs',
            href: index(),
        },
    ],
};
