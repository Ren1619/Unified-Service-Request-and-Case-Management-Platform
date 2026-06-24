<?php

namespace App\Http\Controllers;

use App\Enums\CaseStatus;
use App\Enums\UserRole;
use App\Models\CaseTimeline;
use App\Models\Contact;
use App\Models\ContactGroup;
use App\Models\ServiceCase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SummaryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorizeSummaryAccess($request);

        return Inertia::render('summary/index', [
            'metrics' => $this->metrics(),
            'statusBreakdown' => $this->statusBreakdown(),
            'recentActivity' => $this->recentActivity(),
        ]);
    }

    public function exportOverview(Request $request): StreamedResponse
    {
        $this->authorizeSummaryAccess($request);

        $metrics = $this->metrics();

        return $this->downloadCsv('summary-overview.csv', ['Metric', 'Value', 'Detail'], [
            ['Total complaints', $metrics['complaints']['total'], "{$metrics['complaints']['open']} open"],
            ['Resolved complaints', $metrics['complaints']['resolved'], "{$metrics['complaints']['closed']} closed"],
            ['Contacts', $metrics['contacts'], "{$metrics['groups']} groups"],
            ['System users', $metrics['users'], 'Accounts tracked'],
        ]);
    }

    public function exportStatus(Request $request): StreamedResponse
    {
        $this->authorizeSummaryAccess($request);

        return $this->downloadCsv(
            'summary-status-breakdown.csv',
            ['Status', 'Count'],
            array_map(
                fn (array $status): array => [$status['label'], $status['count']],
                $this->statusBreakdown(),
            ),
        );
    }

    public function exportActivity(Request $request): StreamedResponse
    {
        $this->authorizeSummaryAccess($request);

        return $this->downloadCsv(
            'summary-recent-activity.csv',
            ['Complaint', 'Title', 'Status', 'Event', 'Description', 'Actor', 'Created At'],
            $this->recentActivity()
                ->map(fn (array $activity): array => [
                    $activity['case']['case_number'] ?? 'Archived complaint',
                    $activity['case']['title'] ?? '',
                    $activity['case']['status'] ?? '',
                    str_replace('_', ' ', $activity['event']),
                    $activity['description'] ?? '',
                    $activity['creator']['name'] ?? 'System',
                    $activity['created_at'] ?? '',
                ])
                ->all(),
        );
    }

    private function authorizeSummaryAccess(Request $request): void
    {
        abort_unless($request->user()?->hasAnyRole([
            UserRole::SuperAdmin,
            UserRole::CentralAdministrator,
            UserRole::RegionalAdministrator,
            UserRole::Supervisor,
        ]) ?? false, 403);
    }

    /**
     * @return array{complaints: array{total: int, open: int, resolved: int, closed: int}, contacts: int, groups: int, users: int}
     */
    private function metrics(): array
    {
        return [
            'complaints' => [
                'total' => ServiceCase::query()->count(),
                'open' => ServiceCase::query()
                    ->whereNotIn('status', [
                        CaseStatus::Resolved->value,
                        CaseStatus::Closed->value,
                        CaseStatus::Rejected->value,
                    ])
                    ->count(),
                'resolved' => ServiceCase::query()->where('status', CaseStatus::Resolved)->count(),
                'closed' => ServiceCase::query()->where('status', CaseStatus::Closed)->count(),
            ],
            'contacts' => Contact::query()->count(),
            'groups' => ContactGroup::query()->count(),
            'users' => User::query()->count(),
        ];
    }

    /**
     * @return array<int, array{status: string, label: string, count: int}>
     */
    private function statusBreakdown(): array
    {
        return array_map(
            fn (CaseStatus $status): array => [
                'status' => $status->value,
                'label' => $status->label(),
                'count' => ServiceCase::query()->where('status', $status)->count(),
            ],
            CaseStatus::cases(),
        );
    }

    /**
     * @return Collection<int, array{id: int, event: string, description: string|null, created_at: string|null, creator: array{id: int, name: string, email: string}|null, case: array{id: int, case_number: string, title: string, status: string}|null}>
     */
    private function recentActivity(): Collection
    {
        return CaseTimeline::query()
            ->with([
                'creator:id,name,email',
                'serviceCase:id,case_number,title,status',
            ])
            ->latest()
            ->limit(12)
            ->get(['id', 'service_case_id', 'event', 'description', 'created_by', 'created_at'])
            ->map(fn (CaseTimeline $timeline): array => [
                'id' => $timeline->id,
                'event' => $timeline->event,
                'description' => $timeline->description,
                'created_at' => $timeline->created_at?->toISOString(),
                'creator' => $timeline->creator === null ? null : [
                    'id' => $timeline->creator->id,
                    'name' => $timeline->creator->name,
                    'email' => $timeline->creator->email,
                ],
                'case' => $timeline->serviceCase === null ? null : [
                    'id' => $timeline->serviceCase->id,
                    'case_number' => $timeline->serviceCase->case_number,
                    'title' => $timeline->serviceCase->title,
                    'status' => $timeline->serviceCase->status->value,
                ],
            ]);
    }

    /**
     * @param  array<int, string>  $headers
     * @param  array<int, array<int, mixed>>  $rows
     */
    private function downloadCsv(string $filename, array $headers, array $rows): StreamedResponse
    {
        return response()->streamDownload(function () use ($headers, $rows): void {
            $output = fopen('php://output', 'w');

            if ($output === false) {
                return;
            }

            fputcsv($output, $headers);

            foreach ($rows as $row) {
                fputcsv($output, $row);
            }

            fclose($output);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
