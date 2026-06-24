<?php

namespace App\Http\Controllers;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\CaseStatus;
use App\Enums\UserRole;
use App\Http\Requests\StoreCaseRequest;
use App\Http\Requests\UpdateCaseRequest;
use App\Http\Requests\UpdateCaseStatusRequest;
use App\Models\ComplaintType;
use App\Models\Region;
use App\Models\ServiceCase;
use App\Models\User;
use App\Services\CaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CaseController extends Controller
{
    public function __construct(private readonly CaseService $cases) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ServiceCase::class);

        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString() ?: null,
            'priority' => $request->string('priority')->toString() ?: null,
            'region_id' => $request->string('region_id')->toString() ?: null,
            'assigned_to' => $request->string('assigned_to')->toString() ?: null,
        ];

        /** @var User $user */
        $user = $request->user();

        return Inertia::render('cases/index', [
            'cases' => $this->cases->paginateForIndex($filters, $user),
            'filters' => $filters,
            'options' => $this->formOptions(),
            'can' => [
                'create' => $user->can('create', ServiceCase::class),
                'update' => $user->can('update', ServiceCase::make()),
                'delete' => $user->can('delete', ServiceCase::make()),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', ServiceCase::class);

        return Inertia::render('cases/create', [
            'options' => $this->formOptions(),
        ]);
    }

    public function store(StoreCaseRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $case = $this->cases->create($request->caseData(), $user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Case created.')]);

        return to_route('cases.show', $case);
    }

    public function show(Request $request, ServiceCase $case): Response
    {
        Gate::authorize('view', $case);

        $case->load([
            'assignee:id,name,email',
            'complaintType:id,name',
            'agent:id,name,email',
            'region:id,code,name',
            'submitter:id,name,email',
            'timelines.creator:id,name,email',
        ]);

        return Inertia::render('cases/view', [
            'caseRecord' => $case,
            'can' => [
                'update' => $request->user()?->can('update', $case) ?? false,
                'delete' => $request->user()?->can('delete', $case) ?? false,
            ],
        ]);
    }

    public function edit(ServiceCase $case): Response
    {
        Gate::authorize('update', $case);

        $case->load([
            'assignee:id,name,email',
            'complaintType:id,name',
            'region:id,code,name',
            'submitter:id,name,email',
        ]);

        return Inertia::render('cases/edit', [
            'caseRecord' => $case,
            'options' => $this->formOptions(),
        ]);
    }

    public function update(UpdateCaseRequest $request, ServiceCase $case): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $case = $this->cases->update($case, $request->caseData(), $user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Case updated.')]);

        return to_route('cases.show', $case);
    }

    public function updateStatus(UpdateCaseStatusRequest $request, ServiceCase $case): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->cases->updateStatus($case, $request->status(), $user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Case status updated.')]);

        return back();
    }

    public function destroy(ServiceCase $case): RedirectResponse
    {
        Gate::authorize('delete', $case);

        $case->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Case archived.')]);

        return to_route('cases.index');
    }

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    private function formOptions(): array
    {
        return [
            'assignees' => User::query()
                ->whereHas('roles', fn ($query) => $query->whereIn('code', [
                    UserRole::Supervisor->value,
                    UserRole::CustomerServiceAgent->value,
                    UserRole::CaseOfficer->value,
                ]))
                ->orderBy('name')
                ->get(['id', 'name', 'email'])
                ->all(),
            'channels' => array_map(
                fn (CaseChannel $channel): array => ['value' => $channel->value, 'label' => $channel->label()],
                CaseChannel::intakeSources(),
            ),
            'complaintTypes' => ComplaintType::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->all(),
            'priorities' => array_map(
                fn (CasePriority $priority): array => ['value' => $priority->value, 'label' => $priority->label()],
                CasePriority::cases(),
            ),
            'regions' => Region::query()
                ->where('is_active', true)
                ->orderedForDisplay()
                ->get(['id', 'code', 'name'])
                ->all(),
            'statuses' => array_map(
                fn (CaseStatus $status): array => ['value' => $status->value, 'label' => $status->label()],
                CaseStatus::cases(),
            ),
            'submitters' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email'])
                ->all(),
        ];
    }
}
