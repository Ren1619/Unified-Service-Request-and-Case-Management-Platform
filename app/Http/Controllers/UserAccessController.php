<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\UpdateUserRolesRequest;
use App\Models\User;
use App\Services\UserAccessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserAccessController extends Controller
{
    public function __construct(private readonly UserAccessService $users) {}

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $filters = [
            'search' => $request->string('search')->toString(),
            'role' => $request->string('role')->toString() ?: null,
        ];

        return Inertia::render('users/index', [
            'users' => $this->users->paginateForIndex($filters),
            'roles' => $this->users->rolesForAssignment(),
            'filters' => $filters,
        ]);
    }

    public function create(): void
    {
        abort(404);
    }

    public function store(Request $request): void
    {
        abort(404);
    }

    public function show(Request $request, User $user): Response
    {
        $user->load('roles');

        Gate::authorize('view', $user);

        return Inertia::render('users/view', [
            'user' => $user,
            'can' => [
                'update' => $request->user()?->can('update', $user) ?? false,
            ],
        ]);
    }

    public function edit(Request $request, User $user): Response
    {
        $user->load('roles');

        Gate::authorize('update', $user);

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $this->users->rolesForAssignment(),
            'can' => [
                'assign_super_admin' => $request->user()?->hasRole(UserRole::SuperAdmin) ?? false,
            ],
        ]);
    }

    public function update(UpdateUserRolesRequest $request, User $user): RedirectResponse
    {
        $this->users->updateRoles($request->user(), $request->targetUser(), $request->roleIds());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User roles updated.')]);

        return to_route('users.show', $user);
    }

    public function destroy(User $user): void
    {
        abort(404);
    }
}
