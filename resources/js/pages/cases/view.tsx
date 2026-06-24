import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import CaseStatusBadge from '@/components/case-status-badge';
import Heading from '@/components/heading';
import { PageHeader, PageShell } from '@/components/page-shell';
import PriorityBadge from '@/components/priority-badge';
import { Button } from '@/components/ui/button';
import { edit, index, show } from '@/routes/cases';
import type { ServiceCase } from '@/types';

type CasesViewProps = {
    caseRecord: ServiceCase;
    can: {
        update: boolean;
        delete: boolean;
    };
};

export default function CasesView({ caseRecord, can }: CasesViewProps) {
    return (
        <>
            <Head title={caseRecord.case_number} />

            <PageShell>
                <PageHeader
                    actions={
                        can.update && (
                            <Button asChild>
                                <Link href={edit(caseRecord.id)}>
                                    <Pencil aria-hidden className="size-4" />
                                    Edit
                                </Link>
                            </Button>
                        )
                    }
                >
                    <Heading
                        title={caseRecord.case_number}
                        description={caseRecord.title}
                    />
                </PageHeader>

                <dl className="grid gap-4 rounded-lg border p-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Status
                        </dt>
                        <dd className="mt-1">
                            <CaseStatusBadge status={caseRecord.status} />
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Priority
                        </dt>
                        <dd className="mt-1">
                            <PriorityBadge priority={caseRecord.priority} />
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Region
                        </dt>
                        <dd className="mt-1 font-medium">
                            {caseRecord.region?.name ?? ''}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Complaint type
                        </dt>
                        <dd className="mt-1 font-medium">
                            {caseRecord.complaint_type?.name ?? ''}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Submitted by
                        </dt>
                        <dd className="mt-1">
                            {caseRecord.submitter?.name ?? 'Unknown'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Assigned to
                        </dt>
                        <dd className="mt-1">
                            {caseRecord.assignee?.name ?? 'Unassigned'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">Due</dt>
                        <dd className="mt-1">
                            {caseRecord.due_date
                                ? new Date(caseRecord.due_date).toLocaleString()
                                : 'No due date'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">
                            Source
                        </dt>
                        <dd className="mt-1 capitalize">
                            {caseRecord.channel.replace('_', ' ')}
                        </dd>
                    </div>
                    <div className="md:col-span-2 xl:col-span-4">
                        <dt className="text-sm text-muted-foreground">
                            Description
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap">
                            {caseRecord.description}
                        </dd>
                    </div>
                    {caseRecord.resolution_notes && (
                        <div className="md:col-span-2 xl:col-span-4">
                            <dt className="text-sm text-muted-foreground">
                                Resolution notes
                            </dt>
                            <dd className="mt-1 whitespace-pre-wrap">
                                {caseRecord.resolution_notes}
                            </dd>
                        </div>
                    )}
                </dl>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Timeline</h2>
                    <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Event
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Details
                                    </th>
                                    <th className="hidden px-4 py-3 font-medium md:table-cell">
                                        By
                                    </th>
                                    <th className="hidden px-4 py-3 font-medium lg:table-cell">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(caseRecord.timelines ?? []).map(
                                    (timeline) => (
                                        <tr
                                            key={timeline.id}
                                            className="border-t"
                                        >
                                            <td className="px-4 py-3 font-medium capitalize">
                                                {timeline.event.replaceAll(
                                                    '_',
                                                    ' ',
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {timeline.description}
                                            </td>
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                {timeline.creator?.name ?? ''}
                                            </td>
                                            <td className="hidden px-4 py-3 lg:table-cell">
                                                {timeline.created_at
                                                    ? new Date(
                                                          timeline.created_at,
                                                      ).toLocaleString()
                                                    : ''}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </PageShell>
        </>
    );
}

CasesView.layout = (props: { caseRecord: ServiceCase }) => ({
    breadcrumbs: [
        {
            title: 'Complaints',
            href: index(),
        },
        {
            title: props.caseRecord.case_number,
            href: show(props.caseRecord.id),
        },
    ],
});
