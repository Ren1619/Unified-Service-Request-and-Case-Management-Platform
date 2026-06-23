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
use Inertia\Inertia;
use Inertia\Response;

class SummaryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        abort_unless($request->user()?->hasAnyRole([
            UserRole::SuperAdmin,
            UserRole::CentralAdministrator,
            UserRole::RegionalAdministrator,
            UserRole::Supervisor,
        ]) ?? false, 403);

        return Inertia::render('summary/index', [
            'metrics' => [
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
            ],
            'statusBreakdown' => array_map(
                fn (CaseStatus $status): array => [
                    'status' => $status->value,
                    'label' => $status->label(),
                    'count' => ServiceCase::query()->where('status', $status)->count(),
                ],
                CaseStatus::cases(),
            ),
            'recentActivity' => CaseTimeline::query()
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
                ]),
        ]);
    }
}
