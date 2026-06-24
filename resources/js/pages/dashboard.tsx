import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import {
    AlertTriangle,
    BarChart3,
    ClipboardList,
    Clock3,
    Contact,
    FolderKanban,
    MapPinned,
    ShieldCheck,
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
import PriorityBadge from '@/components/priority-badge';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { index as casesIndex, show as casesShow } from '@/routes/cases';

type BreakdownItem = {
    key: string;
    label: string;
    count: number;
};

type DashboardProps = {
    metrics: {
        cases: {
            total: number;
            open: number;
            overdue: number;
            dueSoon: number;
            createdThisMonth: number;
            resolvedThisMonth: number;
        };
        directory: {
            users: number;
            contacts: number;
            groups: number;
            regions: number;
            complaintTypes: number;
        };
    };
    statusBreakdown: BreakdownItem[];
    priorityBreakdown: BreakdownItem[];
    channelBreakdown: BreakdownItem[];
    topRegions: {
        id: number;
        code: string;
        name: string;
        total: number;
        open: number;
    }[];
    topComplaintTypes: {
        id: number;
        name: string;
        total: number;
    }[];
    recentCases: {
        id: number;
        case_number: string;
        title: string;
        priority: string;
        status: string;
        due_date: string | null;
        created_at: string | null;
        assignee: string | null;
        complaint_type: string | null;
        region: {
            code: string;
            name: string;
        } | null;
    }[];
};

function percent(count: number, total: number): number {
    return total === 0 ? 0 : Math.round((count / total) * 100);
}

function formatDate(value: string | null): string {
    return value ? new Date(value).toLocaleDateString() : 'Unscheduled';
}

function BreakdownBars({
    title,
    items,
    total,
    renderLabel,
}: {
    title: string;
    items: BreakdownItem[];
    total: number;
    renderLabel?: (item: BreakdownItem) => ReactNode;
}) {
    return (
        <section className="rounded-lg border bg-card p-4 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold">{title}</h2>
                <span className="text-xs text-muted-foreground">
                    {total.toLocaleString()} total
                </span>
            </div>

            <div className="space-y-4">
                {items.map((item) => {
                    const width = percent(item.count, total);

                    return (
                        <div key={item.key} className="space-y-2">
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <div className="min-w-0">
                                    {renderLabel ? (
                                        renderLabel(item)
                                    ) : (
                                        <span className="font-medium">
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                                <span className="shrink-0 text-muted-foreground">
                                    {item.count.toLocaleString()}
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary"
                                    style={{ width: `${width}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default function Dashboard({
    metrics,
    statusBreakdown,
    priorityBreakdown,
    channelBreakdown,
    topRegions,
    topComplaintTypes,
    recentCases,
}: DashboardProps) {
    const caseTotal = metrics.cases.total;

    return (
        <>
            <Head title="Dashboard" />

            <PageShell className="max-w-none">
                <PageHeader>
                    <Heading
                        title="Dashboard"
                        description="Monitor system workload, service case health, and operational directory coverage."
                    />
                </PageHeader>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        label="Total cases"
                        value={caseTotal}
                        detail={`${metrics.cases.createdThisMonth.toLocaleString()} created this month`}
                        icon={ClipboardList}
                    />
                    <MetricCard
                        label="Open workload"
                        value={metrics.cases.open}
                        detail={`${percent(metrics.cases.open, caseTotal)}% of all cases`}
                        icon={FolderKanban}
                    />
                    <MetricCard
                        label="Overdue cases"
                        value={metrics.cases.overdue}
                        detail={`${metrics.cases.dueSoon.toLocaleString()} due within 48 hours`}
                        icon={AlertTriangle}
                    />
                    <MetricCard
                        label="Resolved this month"
                        value={metrics.cases.resolvedThisMonth}
                        detail="Resolved or closed cases"
                        icon={ShieldCheck}
                    />
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <MetricCard
                        label="Users"
                        value={metrics.directory.users}
                        detail="Active accounts tracked"
                        icon={Users}
                    />
                    <MetricCard
                        label="Contacts"
                        value={metrics.directory.contacts}
                        detail={`${metrics.directory.groups.toLocaleString()} contact groups`}
                        icon={Contact}
                    />
                    <MetricCard
                        label="Regions"
                        value={metrics.directory.regions}
                        detail="Active service regions"
                        icon={MapPinned}
                    />
                    <MetricCard
                        label="Complaint types"
                        value={metrics.directory.complaintTypes}
                        detail="Active intake categories"
                        icon={BarChart3}
                    />
                    <MetricCard
                        label="Due soon"
                        value={metrics.cases.dueSoon}
                        detail="Next 48 hours"
                        icon={Clock3}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <BreakdownBars
                        title="Status Breakdown"
                        items={statusBreakdown}
                        total={caseTotal}
                        renderLabel={(item) => (
                            <CaseStatusBadge status={item.key} />
                        )}
                    />
                    <BreakdownBars
                        title="Priority Breakdown"
                        items={priorityBreakdown}
                        total={caseTotal}
                        renderLabel={(item) => (
                            <PriorityBadge priority={item.key} />
                        )}
                    />
                    <BreakdownBars
                        title="Source Breakdown"
                        items={channelBreakdown}
                        total={caseTotal}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <section className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-base font-semibold">
                                Top Regions
                            </h2>
                            <Link
                                href={casesIndex()}
                                className="text-sm text-primary underline-offset-4 hover:underline"
                            >
                                View cases
                            </Link>
                        </div>

                        <TableSurface>
                            <table className="w-full text-sm">
                                <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Region
                                        </th>
                                        <th className="w-24 px-4 py-3 text-right font-medium">
                                            Open
                                        </th>
                                        <th className="w-24 px-4 py-3 text-right font-medium">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topRegions.map((region) => (
                                        <tr
                                            key={region.id}
                                            className="border-t transition-colors hover:bg-muted/35"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-medium">
                                                    {region.code}
                                                </p>
                                                <p className="mt-1 max-w-72 truncate text-xs text-muted-foreground">
                                                    {region.name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {region.open.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {region.total.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {topRegions.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4">
                                                <EmptyState
                                                    icon={MapPinned}
                                                    title="No regional workload"
                                                    description="Regional case totals will appear after cases are submitted."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </TableSurface>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-base font-semibold">
                            Top Complaint Types
                        </h2>

                        <TableSurface>
                            <table className="w-full text-sm">
                                <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Type
                                        </th>
                                        <th className="w-24 px-4 py-3 text-right font-medium">
                                            Cases
                                        </th>
                                        <th className="w-28 px-4 py-3 text-right font-medium">
                                            Share
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topComplaintTypes.map((type) => (
                                        <tr
                                            key={type.id}
                                            className="border-t transition-colors hover:bg-muted/35"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {type.name}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {type.total.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">
                                                {percent(type.total, caseTotal)}
                                                %
                                            </td>
                                        </tr>
                                    ))}
                                    {topComplaintTypes.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4">
                                                <EmptyState
                                                    icon={BarChart3}
                                                    title="No complaint type data"
                                                    description="Complaint type rankings will appear after cases are submitted."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </TableSurface>
                    </section>
                </div>

                <section className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-base font-semibold">
                            Recent Cases
                        </h2>
                        <Link
                            href={casesIndex()}
                            className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    <TableSurface>
                        <table className="w-full min-w-[920px] text-sm">
                            <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Case
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Priority
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Region
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Assigned
                                    </th>
                                    <th className="w-32 px-4 py-3 text-right font-medium">
                                        Due
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentCases.map((serviceCase) => (
                                    <tr
                                        key={serviceCase.id}
                                        className="border-t transition-colors hover:bg-muted/35"
                                    >
                                        <td className="px-4 py-3">
                                            <Link
                                                href={casesShow(serviceCase.id)}
                                                className="font-medium text-primary underline-offset-4 hover:underline"
                                            >
                                                {serviceCase.case_number}
                                            </Link>
                                            <p className="mt-1 max-w-96 truncate text-xs text-muted-foreground">
                                                {serviceCase.title}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <CaseStatusBadge
                                                status={serviceCase.status}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <PriorityBadge
                                                priority={serviceCase.priority}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            {serviceCase.region ? (
                                                <Badge variant="secondary">
                                                    {serviceCase.region.code}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Unset
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {serviceCase.assignee ?? (
                                                <span className="text-muted-foreground">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">
                                            {formatDate(serviceCase.due_date)}
                                        </td>
                                    </tr>
                                ))}
                                {recentCases.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4">
                                            <EmptyState
                                                icon={ClipboardList}
                                                title="No cases yet"
                                                description="Recent cases will appear here once service requests are created."
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </TableSurface>
                </section>
            </PageShell>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
