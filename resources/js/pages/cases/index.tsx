import { Head, Link, router } from '@inertiajs/react';
import {
    Check,
    ClipboardList,
    Eye,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import CaseStatusBadge from '@/components/case-status-badge';
import Heading from '@/components/heading';
import {
    EmptyState,
    MobileCardList,
    MobileRecordCard,
    MobileRecordDetail,
    ResponsiveFilterBar,
    TableSurface,
} from '@/components/module-surface';
import NativeSelect from '@/components/native-select';
import { PageHeader, PageShell } from '@/components/page-shell';
import Pagination from '@/components/pagination';
import PriorityBadge from '@/components/priority-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    destroy,
    edit,
    index,
    show,
    status as updateStatus,
} from '@/routes/cases';
import type { CaseFormOptions, Paginated, ServiceCase } from '@/types';
import CaseForm from './case-form';

const statusTransitions: Record<string, string[]> = {
    new: ['assigned', 'in_progress', 'rejected'],
    assigned: ['in_progress', 'escalated', 'rejected'],
    in_progress: ['pending_information', 'escalated', 'resolved', 'rejected'],
    pending_information: ['in_progress', 'escalated', 'rejected'],
    escalated: ['assigned', 'in_progress', 'resolved', 'rejected'],
    resolved: ['closed', 'in_progress'],
    closed: [],
    rejected: [],
};

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
        update: boolean;
        delete: boolean;
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
    const [openCaseId, setOpenCaseId] = useState<number | null>(null);
    const filterFormId = 'cases-filters';

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

    function quickUpdateStatus(caseRecord: ServiceCase, nextStatus: string) {
        router.patch(
            updateStatus(caseRecord.id).url,
            { status: nextStatus },
            {
                preserveScroll: true,
            },
        );
    }

    function nextStatusOptions(caseRecord: ServiceCase) {
        const nextStatuses = statusTransitions[caseRecord.status] ?? [];

        return options.statuses.filter((statusOption) =>
            nextStatuses.includes(statusOption.value),
        );
    }

    function resetFilters() {
        setSearch('');
        setStatus('');
        setPriority('');
        setRegionId('');
        setAssignedTo('');
        router.get(index().url, {}, { preserveState: true, replace: true });
    }

    function CaseActions({ caseRecord }: { caseRecord: ServiceCase }) {
        const statusOptions = nextStatusOptions(caseRecord);

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Open actions for ${caseRecord.case_number}`}
                    >
                        <MoreHorizontal aria-hidden className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href={show(caseRecord.id)}>
                            <Eye aria-hidden className="size-4" />
                            View
                        </Link>
                    </DropdownMenuItem>

                    {can.update && (
                        <DropdownMenuItem asChild>
                            <Link href={edit(caseRecord.id)}>
                                <Pencil aria-hidden className="size-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                    )}

                    {can.update && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    Update status
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-52">
                                    {statusOptions.map((statusOption) => (
                                        <DropdownMenuItem
                                            key={statusOption.value}
                                            disabled={
                                                ['resolved', 'closed'].includes(
                                                    statusOption.value,
                                                ) &&
                                                !caseRecord.resolution_notes
                                            }
                                            onSelect={() =>
                                                quickUpdateStatus(
                                                    caseRecord,
                                                    statusOption.value,
                                                )
                                            }
                                        >
                                            <Check
                                                aria-hidden
                                                className="size-4"
                                            />
                                            {statusOption.label}
                                        </DropdownMenuItem>
                                    ))}
                                    {statusOptions.length === 0 && (
                                        <DropdownMenuItem disabled>
                                            No quick updates
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </>
                    )}

                    {can.delete && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => archive(caseRecord)}
                            >
                                <Trash2 aria-hidden className="size-4" />
                                Archive
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <>
            <Head title="Complaints" />

            <PageShell>
                <PageHeader
                    actions={
                        can.create && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus aria-hidden className="size-4" />
                                        File complaint
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-5xl">
                                    <DialogHeader>
                                        <DialogTitle>
                                            File complaint
                                        </DialogTitle>
                                        <DialogDescription>
                                            Capture an incoming message or call
                                            as a complaint record.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <CaseForm options={options} />
                                </DialogContent>
                            </Dialog>
                        )
                    }
                >
                    <Heading
                        title="Complaints"
                        description="Track complaints, service requests, assignments, and SLA status."
                    />
                </PageHeader>

                <ResponsiveFilterBar
                    formId={filterFormId}
                    onReset={resetFilters}
                    title="Filter complaints"
                >
                    <form
                        id={filterFormId}
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
                                <option key={status.value} value={status.value}>
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

                        <Button
                            type="submit"
                            variant="outline"
                            className="hidden md:inline-flex"
                        >
                            <Search aria-hidden className="size-4" />
                            Search
                        </Button>
                    </form>
                </ResponsiveFilterBar>

                <TableSurface className="hidden md:block">
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
                                <th className="w-16 px-4 py-3 text-right font-medium">
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
                                    <td className="px-4 py-3 text-right">
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
                                        <CaseActions caseRecord={caseRecord} />
                                    </td>
                                </tr>
                            ))}
                            {cases.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4">
                                        <EmptyState
                                            icon={ClipboardList}
                                            title="No complaints found"
                                            description="Try adjusting the filters, or file a new complaint from an incoming message or call."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableSurface>

                <MobileCardList>
                    {cases.data.map((caseRecord) => (
                        <MobileRecordCard
                            key={caseRecord.id}
                            actions={<CaseActions caseRecord={caseRecord} />}
                            badges={
                                <>
                                    <PriorityBadge
                                        priority={caseRecord.priority}
                                    />
                                    <CaseStatusBadge
                                        status={caseRecord.status}
                                    />
                                </>
                            }
                            description={caseRecord.title}
                            isOpen={openCaseId === caseRecord.id}
                            onOpenChange={(open) =>
                                setOpenCaseId(open ? caseRecord.id : null)
                            }
                            title={caseRecord.case_number}
                        >
                            <MobileRecordDetail label="Region">
                                {caseRecord.region?.code ?? 'No region'}
                            </MobileRecordDetail>
                            <MobileRecordDetail label="Assignee">
                                {caseRecord.assignee?.name ?? 'Unassigned'}
                            </MobileRecordDetail>
                            <MobileRecordDetail label="Due">
                                {caseRecord.due_date
                                    ? new Date(
                                          caseRecord.due_date,
                                      ).toLocaleDateString()
                                    : 'No due date'}
                            </MobileRecordDetail>
                            <MobileRecordDetail label="Status">
                                <CaseStatusBadge status={caseRecord.status} />
                            </MobileRecordDetail>
                        </MobileRecordCard>
                    ))}
                    {cases.data.length === 0 && (
                        <EmptyState
                            icon={ClipboardList}
                            title="No complaints found"
                            description="Try adjusting the filters, or file a new complaint from an incoming message or call."
                        />
                    )}
                </MobileCardList>

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
