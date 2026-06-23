import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import CaseStatusBadge from '@/components/case-status-badge';
import Heading from '@/components/heading';
import {
    EmptyState,
    FilterBar,
    TableSurface,
} from '@/components/module-surface';
import NativeSelect from '@/components/native-select';
import { PageHeader, PageShell } from '@/components/page-shell';
import Pagination from '@/components/pagination';
import PriorityBadge from '@/components/priority-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { create, destroy, edit, index, show } from '@/routes/cases';
import type { CaseFormOptions, Paginated, ServiceCase } from '@/types';

type CasesIndexProps = {
    cases: Paginated<ServiceCase>;
    filters: {
        search?: string | null;
        status?: string | null;
        priority?: string | null;
        region_id?: string | null;
        assigned_to?: string | null;
    };
    options: CaseFormOptions;
    can: {
        create: boolean;
    };
};

export default function CasesIndex({
    cases,
    filters,
    options,
    can,
}: CasesIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [priority, setPriority] = useState(filters.priority ?? '');
    const [regionId, setRegionId] = useState(filters.region_id ?? '');
    const [assignedTo, setAssignedTo] = useState(filters.assigned_to ?? '');

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            index().url,
            {
                search,
                status,
                priority,
                region_id: regionId,
                assigned_to: assignedTo,
            },
            { preserveState: true, replace: true },
        );
    }

    function archive(caseRecord: ServiceCase) {
        if (!window.confirm(`Archive ${caseRecord.case_number}?`)) {
            return;
        }

        router.delete(destroy(caseRecord.id).url, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Complaints" />

            <PageShell>
                <PageHeader
                    actions={
                        can.create && (
                            <Button asChild>
                                <Link href={create()}>
                                    <Plus aria-hidden className="size-4" />
                                    File complaint
                                </Link>
                            </Button>
                        )
                    }
                >
                    <Heading
                        title="Complaints"
                        description="Track complaints, service requests, assignments, and SLA status."
                    />
                </PageHeader>

                <FilterBar>
                    <form
                        onSubmit={submit}
                        className="grid gap-3 md:grid-cols-2 xl:grid-cols-6"
                    >
                        <div className="relative md:col-span-2 xl:col-span-2">
                            <Search
                                aria-hidden
                                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search complaints"
                                className="pl-9"
                            />
                        </div>

                        <NativeSelect
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                        >
                            <option value="">All statuses</option>
                            {options.statuses.map((status) => (
                                <option
                                    key={status.value}
                                    value={status.value}
                                >
                                    {status.label}
                                </option>
                            ))}
                        </NativeSelect>

                        <NativeSelect
                            value={priority}
                            onChange={(event) =>
                                setPriority(event.target.value)
                            }
                        >
                            <option value="">All priorities</option>
                            {options.priorities.map((priority) => (
                                <option
                                    key={priority.value}
                                    value={priority.value}
                                >
                                    {priority.label}
                                </option>
                            ))}
                        </NativeSelect>

                        <NativeSelect
                            value={regionId}
                            onChange={(event) =>
                                setRegionId(event.target.value)
                            }
                        >
                            <option value="">All regions</option>
                            {options.regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.code}
                                </option>
                            ))}
                        </NativeSelect>

                        <NativeSelect
                            value={assignedTo}
                            onChange={(event) =>
                                setAssignedTo(event.target.value)
                            }
                        >
                            <option value="">All assignees</option>
                            {options.assignees.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </NativeSelect>

                        <Button type="submit" variant="outline">
                            <Search aria-hidden className="size-4" />
                            Search
                        </Button>
                    </form>
                </FilterBar>

                <TableSurface>
                    <table className="w-full min-w-[860px] text-sm">
                        <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">Case</th>
                                <th className="hidden px-4 py-3 font-medium lg:table-cell">
                                    Region
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Priority
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="hidden px-4 py-3 font-medium xl:table-cell">
                                    Assignee
                                </th>
                                <th className="hidden px-4 py-3 font-medium xl:table-cell">
                                    Due
                                </th>
                                <th className="w-32 px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.data.map((caseRecord) => (
                                <tr
                                    key={caseRecord.id}
                                    className="border-t transition-colors hover:bg-muted/35"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {caseRecord.case_number}
                                        </div>
                                        <div className="max-w-72 truncate text-xs text-muted-foreground">
                                            {caseRecord.title}
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 lg:table-cell">
                                        {caseRecord.region?.code ?? ''}
                                    </td>
                                    <td className="px-4 py-3">
                                        <PriorityBadge
                                            priority={caseRecord.priority}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <CaseStatusBadge
                                            status={caseRecord.status}
                                        />
                                    </td>
                                    <td className="hidden px-4 py-3 xl:table-cell">
                                        {caseRecord.assignee?.name ??
                                            'Unassigned'}
                                    </td>
                                    <td className="hidden px-4 py-3 xl:table-cell">
                                        {caseRecord.due_date
                                            ? new Date(
                                                  caseRecord.due_date,
                                              ).toLocaleDateString()
                                            : ''}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={show(caseRecord.id)}
                                                    aria-label={`View ${caseRecord.case_number}`}
                                                >
                                                    <Eye
                                                        aria-hidden
                                                        className="size-4"
                                                    />
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                            >
                                                <Link
                                                    href={edit(caseRecord.id)}
                                                    aria-label={`Edit ${caseRecord.case_number}`}
                                                >
                                                    <Pencil
                                                        aria-hidden
                                                        className="size-4"
                                                    />
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    archive(caseRecord)
                                                }
                                                aria-label={`Archive ${caseRecord.case_number}`}
                                            >
                                                <Trash2
                                                    aria-hidden
                                                    className="size-4"
                                                />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {cases.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-4"
                                    >
                                        <EmptyState
                                            icon={ClipboardList}
                                            title="No complaints found"
                                            description="Try adjusting the filters, or file a new complaint from an SMS, call, or walk-in report."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableSurface>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {cases.from ?? 0} to {cases.to ?? 0} of{' '}
                        {cases.total}
                    </p>
                    <Pagination links={cases.links} />
                </div>
            </PageShell>
        </>
    );
}

CasesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Complaints',
            href: index(),
        },
    ],
};
