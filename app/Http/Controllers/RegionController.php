<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegionRequest;
use App\Http\Requests\UpdateRegionRequest;
use App\Models\Region;
use App\Services\RegionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RegionController extends Controller
{
    public function __construct(private readonly RegionService $regions) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Region::class);

        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString() ?: null,
        ];

        return Inertia::render('regions/index', [
            'regions' => $this->regions->paginateForIndex($filters),
            'filters' => $filters,
            'can' => [
                'create' => $request->user()?->can('create', Region::class) ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Region::class);

        return Inertia::render('regions/create');
    }

    public function store(StoreRegionRequest $request): RedirectResponse
    {
        $this->regions->create($request->regionData());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Region created.')]);

        return to_route('regions.index');
    }

    public function show(Request $request, Region $region): Response
    {
        Gate::authorize('view', $region);

        return Inertia::render('regions/view', [
            'region' => $region,
            'can' => [
                'update' => $request->user()?->can('update', $region) ?? false,
            ],
        ]);
    }

    public function edit(Region $region): Response
    {
        Gate::authorize('update', $region);

        return Inertia::render('regions/edit', [
            'region' => $region,
        ]);
    }

    public function update(UpdateRegionRequest $request, Region $region): RedirectResponse
    {
        $this->regions->update($region, $request->regionData());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Region updated.')]);

        return to_route('regions.show', $region);
    }

    public function destroy(Region $region): RedirectResponse
    {
        Gate::authorize('delete', $region);

        $this->regions->delete($region);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Region archived.')]);

        return to_route('regions.index');
    }
}
