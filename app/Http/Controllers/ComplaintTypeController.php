<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreComplaintTypeRequest;
use App\Http\Requests\UpdateComplaintTypeRequest;
use App\Models\ComplaintType;
use App\Services\ComplaintTypeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ComplaintTypeController extends Controller
{
    public function __construct(private readonly ComplaintTypeService $complaintTypes) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ComplaintType::class);

        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString() ?: null,
        ];

        return Inertia::render('complaint-types/index', [
            'complaintTypes' => $this->complaintTypes->paginateForIndex($filters),
            'filters' => $filters,
            'can' => [
                'create' => $request->user()?->can('create', ComplaintType::class) ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', ComplaintType::class);

        return Inertia::render('complaint-types/create');
    }

    public function store(StoreComplaintTypeRequest $request): RedirectResponse
    {
        $this->complaintTypes->create($request->complaintTypeData());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Complaint type created.')]);

        return to_route('complaint-types.index');
    }

    public function show(Request $request, ComplaintType $complaintType): Response
    {
        Gate::authorize('view', $complaintType);

        return Inertia::render('complaint-types/view', [
            'complaintType' => $complaintType,
            'can' => [
                'update' => $request->user()?->can('update', $complaintType) ?? false,
            ],
        ]);
    }

    public function edit(ComplaintType $complaintType): Response
    {
        Gate::authorize('update', $complaintType);

        return Inertia::render('complaint-types/edit', [
            'complaintType' => $complaintType,
        ]);
    }

    public function update(UpdateComplaintTypeRequest $request, ComplaintType $complaintType): RedirectResponse
    {
        $this->complaintTypes->update($complaintType, $request->complaintTypeData());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Complaint type updated.')]);

        return to_route('complaint-types.show', $complaintType);
    }

    public function destroy(ComplaintType $complaintType): RedirectResponse
    {
        Gate::authorize('delete', $complaintType);

        $this->complaintTypes->delete($complaintType);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Complaint type archived.')]);

        return to_route('complaint-types.index');
    }
}
