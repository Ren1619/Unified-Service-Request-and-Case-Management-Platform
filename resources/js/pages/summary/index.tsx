import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ClipboardList,
    Contact,
    Download,
    Users,
} from 'lucide-react';
import CaseStatusBadge from '@/components/case-status-badge';
import Heading from '@/components/heading';
import {
    EmptyState,
    MetricCard,
    TableSurface,
} from '@/components/module-surface';
import { PageHeader, PageShell } from '@/components/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index as casesIndex, show as casesShow } from '@/routes/cases';
import { index } from '@/routes/summary';
import {
    activity as exportActivity,
    overview as exportOverview,
    status as exportStatus,
} from '@/routes/summary/export';

type SummaryMetric = {
    label: string;
    value: number;
    detail: string;
    icon: typeof ClipboardList;
};

type SummaryProps = {
    metrics: {
        complaints: {
            total: number;
            open: number;
            resolved: number;
            closed: number;
        };
        contacts: number;
        groups: number;
        users: number;
    };
    statusBreakdown: {
        status: string;
        label: string;
        count: number;
    }[];
    recentActivity: {
        id: number;
        event: string;
        description: string | null;
        created_at: string | null;
        creator: {
            id: number;
            name: string;
            email: string;
        } | null;
        case: {
            id: number;
            case_number: string;
            title: string;
            status: string;
        } | null;
    }[];
};

export default function SummaryIndex({
    metrics,
    statusBreakdown,
    recentActivity,
}: SummaryProps) {
    const cards: SummaryMetric[] = [
        {
            label: 'Total complaints',
            value: metrics.complaints.total,
            detail: `${metrics.complaints.open} open`,
            icon: ClipboardList,
        },
        {
            label: 'Resolved complaints',
            value: metrics.complaints.resolved,
            detail: `${metrics.complaints.closed} closed`,
            icon: Activity,
        },
        {
            label: 'Contacts',
            value: metrics.contacts,
            detail: `${metrics.groups} groups`,
            icon: Contact,
        },
        {
            label: 'System users',
            value: metrics.users,
            detail: 'Accounts tracked',
            icon: Users,
        },
    ];
    const exports = [
        {
            label: 'Overview',
            href: exportOverview.url(),
        },
        {
            label: 'Status',
            href: exportStatus.url(),
        },
        {
            label: 'Activity',
            href: exportActivity.url(),
        },
    ];

    return (
        <>
            <Head title="Summary" />

            <PageShell>
                <PageHeader
                    actions={exports.map((item) => (
                        <Button
                            key={item.label}
                            asChild
                            variant="outline"
                            size="sm"
                        >
                            <a href={item.href} download>
                                <Download aria-hidden className="size-4" />
                                {item.label}
                            </a>
                        </Button>
                    ))}
                >
                    <Heading
                        title="Summary"
                        description="Review complaint workload, communication support data, and recent case activity for auditing."
                    />
                </PageHeader>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <MetricCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            detail={card.detail}
                            icon={card.icon}
                        />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <section className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-base font-semibold">
                                Complaint Status
                            </h2>
                            <Link
                                href={casesIndex()}
                                className="text-sm text-primary underline-offset-4 hover:underline"
                            >
                                View complaints
                            </Link>
                        </div>

                        <TableSurface>
                            <table className="w-full text-sm">
                                <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="w-24 px-4 py-3 text-right font-medium">
                                            Count
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statusBreakdown.map((item) => (
                                        <tr
                                            key={item.status}
                                            className="border-t transition-colors hover:bg-muted/35"
                                        >
                                            <td className="px-4 py-3">
                                                <CaseStatusBadge
                                                    status={item.status}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {item.count.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableSurface>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-semibold">
                            Recent Activity
                        </h2>

                        <TableSurface>
                            <table className="w-full min-w-[760px] text-sm">
                                <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Complaint
                                        </th>
                                        <th className="hidden px-4 py-3 font-medium lg:table-cell">
                                            Event
                                        </th>
                                        <th className="hidden px-4 py-3 font-medium xl:table-cell">
                                            Actor
                                        </th>
                                        <th className="w-32 px-4 py-3 text-right font-medium">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentActivity.map((activity) => (
                                        <tr
                                            key={activity.id}
                                            className="border-t transition-colors hover:bg-muted/35"
                                        >
                                            <td className="px-4 py-3">
                                                {activity.case ? (
                                                    <Link
                                                        href={casesShow(
                                                            activity.case.id,
                                                        )}
                                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                                    >
                                                        {
                                                            activity.case
                                                                .case_number
                                                        }
                                                    </Link>
                                                ) : (
                                                    <span className="font-medium">
                                                        Archived complaint
                                                    </span>
                                                )}
                                                <p className="mt-1 max-w-80 truncate text-xs text-muted-foreground">
                                                    {activity.description ??
                                                        activity.case?.title ??
                                                        'No description recorded'}
                                                </p>
                                            </td>
                                            <td className="hidden px-4 py-3 lg:table-cell">
                                                <Badge variant="secondary">
                                                    {activity.event.replaceAll(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="hidden px-4 py-3 xl:table-cell">
                                                {activity.creator?.name ??
                                                    'System'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {activity.created_at
                                                    ? new Date(
                                                          activity.created_at,
                                                      ).toLocaleDateString()
                                                    : ''}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentActivity.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-4"
                                            >
                                                <EmptyState
                                                    icon={Activity}
                                                    title="No recent activity"
                                                    description="Complaint timeline activity will appear here after cases are filed or updated."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </TableSurface>
                    </section>
                </div>
            </PageShell>
        </>
    );
}

SummaryIndex.layout = {
    breadcrumbs: [
        {
            title: 'Summary',
            href: index(),
        },
    ],
};
