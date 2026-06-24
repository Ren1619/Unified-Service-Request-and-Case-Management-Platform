<?php

namespace App\Http\Controllers;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\CaseStatus;
use App\Models\ComplaintType;
use App\Models\Contact;
use App\Models\ContactGroup;
use App\Models\Region;
use App\Models\ServiceCase;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $openStatuses = [
            CaseStatus::New->value,
            CaseStatus::Assigned->value,
            CaseStatus::InProgress->value,
            CaseStatus::PendingInformation->value,
            CaseStatus::Escalated->value,
        ];

        return Inertia::render('dashboard', [
            'metrics' => [
                'cases' => [
                    'total' => ServiceCase::query()->count(),
                    'open' => ServiceCase::query()->whereIn('status', $openStatuses)->count(),
                    'overdue' => ServiceCase::query()
                        ->whereIn('status', $openStatuses)
                        ->where('due_date', '<', now())
                        ->count(),
                    'dueSoon' => ServiceCase::query()
                        ->whereIn('status', $openStatuses)
                        ->whereBetween('due_date', [now(), now()->addDays(2)])
                        ->count(),
                    'createdThisMonth' => ServiceCase::query()
                        ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
                        ->count(),
                    'resolvedThisMonth' => ServiceCase::query()
                        ->whereIn('status', [CaseStatus::Resolved, CaseStatus::Closed])
                        ->whereBetween('closed_at', [now()->startOfMonth(), now()->endOfMonth()])
                        ->count(),
                ],
                'directory' => [
                    'users' => User::query()->count(),
                    'contacts' => Contact::query()->count(),
                    'groups' => ContactGroup::query()->count(),
                    'regions' => Region::query()->where('is_active', true)->count(),
                    'complaintTypes' => ComplaintType::query()->where('is_active', true)->count(),
                ],
            ],
            'statusBreakdown' => $this->caseBreakdown(CaseStatus::cases(), 'status'),
            'priorityBreakdown' => $this->caseBreakdown(CasePriority::cases(), 'priority'),
            'channelBreakdown' => $this->caseBreakdown(CaseChannel::intakeSources(), 'channel'),
            'topRegions' => DB::table('cases')
                ->join('regions', 'regions.id', '=', 'cases.region_id')
                ->whereNull('cases.deleted_at')
                ->select('regions.id', 'regions.code', 'regions.name')
                ->selectRaw('count(*) as total')
                ->selectRaw(
                    'sum(case when cases.status in (?, ?, ?, ?, ?) then 1 else 0 end) as open',
                    $openStatuses,
                )
                ->groupBy('regions.id', 'regions.code', 'regions.name')
                ->orderByDesc('total')
                ->orderByRaw(Region::displayOrderSql('regions.code'), Region::displayOrderBindings())
                ->limit(5)
                ->get()
                ->map(fn (object $region): array => [
                    'id' => (int) $region->id,
                    'code' => (string) $region->code,
                    'name' => (string) $region->name,
                    'total' => (int) $region->total,
                    'open' => (int) $region->open,
                ]),
            'topComplaintTypes' => DB::table('cases')
                ->join('complaint_types', 'complaint_types.id', '=', 'cases.complaint_type_id')
                ->whereNull('cases.deleted_at')
                ->select('complaint_types.id', 'complaint_types.name')
                ->selectRaw('count(*) as total')
                ->groupBy('complaint_types.id', 'complaint_types.name')
                ->orderByDesc('total')
                ->limit(5)
                ->get()
                ->map(fn (object $complaintType): array => [
                    'id' => (int) $complaintType->id,
                    'name' => (string) $complaintType->name,
                    'total' => (int) $complaintType->total,
                ]),
            'recentCases' => ServiceCase::query()
                ->with([
                    'assignee:id,name',
                    'complaintType:id,name',
                    'region:id,code,name',
                ])
                ->latest()
                ->limit(6)
                ->get([
                    'id',
                    'case_number',
                    'title',
                    'complaint_type_id',
                    'priority',
                    'status',
                    'region_id',
                    'assigned_to',
                    'due_date',
                    'created_at',
                ])
                ->map(fn (ServiceCase $case): array => [
                    'id' => $case->id,
                    'case_number' => $case->case_number,
                    'title' => $case->title,
                    'priority' => $case->priority->value,
                    'status' => $case->status->value,
                    'due_date' => $case->due_date?->toISOString(),
                    'created_at' => $case->created_at?->toISOString(),
                    'assignee' => $case->assignee?->name,
                    'complaint_type' => $case->complaintType?->name,
                    'region' => $case->region === null ? null : [
                        'code' => $case->region->code,
                        'name' => $case->region->name,
                    ],
                ]),
        ]);
    }

    /**
     * @param  array<int, CaseStatus|CasePriority|CaseChannel>  $cases
     * @return array<int, array{key: string, label: string, count: int}>
     */
    private function caseBreakdown(array $cases, string $column): array
    {
        $counts = ServiceCase::query()
            ->select($column)
            ->selectRaw('count(*) as aggregate')
            ->groupBy($column)
            ->pluck('aggregate', $column);

        return array_map(
            fn (CaseStatus|CasePriority|CaseChannel $case): array => [
                'key' => $case->value,
                'label' => $case->label(),
                'count' => (int) ($counts[$case->value] ?? 0),
            ],
            $cases,
        );
    }
}
