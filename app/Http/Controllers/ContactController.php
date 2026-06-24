<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use App\Models\ContactGroup;
use App\Models\Region;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Contact::class);

        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString() ?: null,
            'group_id' => $request->string('group_id')->toString() ?: null,
            'region_id' => $request->string('region_id')->toString() ?: null,
        ];

        return Inertia::render('contacts/index', [
            'contacts' => Contact::query()
                ->with(['groups:id,name', 'region:id,code,name'])
                ->when($filters['search'] ?? null, function ($query, string $search): void {
                    $query->where(function ($query) use ($search): void {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('mobile_number', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('organization', 'like', "%{$search}%")
                            ->orWhereHas('region', function ($query) use ($search): void {
                                $query->where('code', 'like', "%{$search}%")
                                    ->orWhere('name', 'like', "%{$search}%");
                            });
                    });
                })
                ->when(($filters['status'] ?? null) === 'active', fn ($query) => $query->where('is_active', true))
                ->when(($filters['status'] ?? null) === 'inactive', fn ($query) => $query->where('is_active', false))
                ->when($filters['group_id'] ?? null, fn ($query, string $groupId) => $query->whereHas('groups', fn ($query) => $query->whereKey($groupId)))
                ->when($filters['region_id'] ?? null, fn ($query, string $regionId) => $query->where('region_id', $regionId))
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'filters' => $filters,
            'groups' => $this->groupsForSelect(),
            'regions' => $this->regionsForSelect(),
            'can' => [
                'create' => $request->user()?->can('create', Contact::class) ?? false,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Contact::class);

        return Inertia::render('contacts/create', [
            'groups' => $this->groupsForSelect(),
            'regions' => $this->regionsForSelect(),
        ]);
    }

    public function store(StoreContactRequest $request): RedirectResponse
    {
        $contact = Contact::query()->create($request->contactData());
        $contact->groups()->sync($request->groupIds());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Contact created.')]);

        return to_route('contacts.show', $contact);
    }

    public function show(Request $request, Contact $contact): Response
    {
        Gate::authorize('view', $contact);

        $contact->load(['groups:id,name', 'region:id,code,name']);

        return Inertia::render('contacts/view', [
            'contact' => $contact,
            'can' => [
                'update' => $request->user()?->can('update', $contact) ?? false,
            ],
        ]);
    }

    public function edit(Contact $contact): Response
    {
        Gate::authorize('update', $contact);

        $contact->load(['groups:id,name', 'region:id,code,name']);

        return Inertia::render('contacts/edit', [
            'contact' => $contact,
            'groups' => $this->groupsForSelect(),
            'regions' => $this->regionsForSelect($contact),
        ]);
    }

    public function update(UpdateContactRequest $request, Contact $contact): RedirectResponse
    {
        $contact->update($request->contactData());
        $contact->groups()->sync($request->groupIds());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Contact updated.')]);

        return to_route('contacts.show', $contact);
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        Gate::authorize('delete', $contact);

        $contact->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Contact archived.')]);

        return to_route('contacts.index');
    }

    /**
     * @return array<int, ContactGroup>
     */
    private function groupsForSelect(): array
    {
        return ContactGroup::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->all();
    }

    /**
     * @return array<int, Region>
     */
    private function regionsForSelect(?Contact $contact = null): array
    {
        return Region::query()
            ->where(function ($query) use ($contact): void {
                $query->where('is_active', true)
                    ->when($contact?->region_id, fn ($query, int $regionId) => $query->orWhereKey($regionId));
            })
            ->orderedForDisplay()
            ->get(['id', 'code', 'name'])
            ->all();
    }
}
