<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactGroupRequest;
use App\Http\Requests\UpdateContactGroupRequest;
use App\Models\Contact;
use App\Models\ContactGroup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContactGroupController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ContactGroup::class);

        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString() ?: null,
        ];

        return Inertia::render('groups/index', [
            'groups' => ContactGroup::query()
                ->withCount('contacts')
                ->when($filters['search'] ?? null, function ($query, string $search): void {
                    $query->where(function ($query) use ($search): void {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
                })
                ->when(($filters['status'] ?? null) === 'active', fn ($query) => $query->where('is_active', true))
                ->when(($filters['status'] ?? null) === 'inactive', fn ($query) => $query->where('is_active', false))
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'filters' => $filters,
            'can' => [
                'create' => $request->user()?->can('create', ContactGroup::class) ?? false,
            ],
        ]);
    }

    public function cluster(): Response
    {
        Gate::authorize('viewAny', ContactGroup::class);

        return Inertia::render('groups/cluster', [
            'groups' => ContactGroup::query()
                ->withCount('contacts')
                ->with(['contacts' => fn ($query) => $query->orderBy('name')->limit(6)])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', ContactGroup::class);

        return Inertia::render('groups/create', [
            'contacts' => $this->contactsForSelect(),
        ]);
    }

    public function store(StoreContactGroupRequest $request): RedirectResponse
    {
        $group = ContactGroup::query()->create($request->groupData());
        $group->contacts()->sync($request->contactIds());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Group created.')]);

        return to_route('groups.show', $group);
    }

    public function show(Request $request, ContactGroup $group): Response
    {
        Gate::authorize('view', $group);

        $group->load('contacts:id,name,mobile_number,email,is_active')->loadCount('contacts');

        return Inertia::render('groups/view', [
            'group' => $group,
            'can' => [
                'update' => $request->user()?->can('update', $group) ?? false,
            ],
        ]);
    }

    public function edit(ContactGroup $group): Response
    {
        Gate::authorize('update', $group);

        $group->load('contacts:id,name');

        return Inertia::render('groups/edit', [
            'group' => $group,
            'contacts' => $this->contactsForSelect(),
        ]);
    }

    public function update(UpdateContactGroupRequest $request, ContactGroup $group): RedirectResponse
    {
        $group->update($request->groupData());
        $group->contacts()->sync($request->contactIds());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Group updated.')]);

        return to_route('groups.show', $group);
    }

    public function destroy(ContactGroup $group): RedirectResponse
    {
        Gate::authorize('delete', $group);

        $group->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Group archived.')]);

        return to_route('groups.index');
    }

    /**
     * @return array<int, Contact>
     */
    private function contactsForSelect(): array
    {
        return Contact::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'mobile_number', 'email'])
            ->all();
    }
}
