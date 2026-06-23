<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\UserAccessRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class UserAccessService
{
    public function __construct(private readonly UserAccessRepositoryInterface $users) {}

    /**
     * @param  array{search?: string|null, role?: string|null}  $filters
     * @return LengthAwarePaginator<int, User>
     */
    public function paginateForIndex(array $filters): LengthAwarePaginator
    {
        return $this->users->paginateForIndex($filters);
    }

    /**
     * @return Collection<int, Role>
     */
    public function rolesForAssignment(): Collection
    {
        return $this->users->rolesForAssignment();
    }

    /**
     * @param  array<int, int>  $roleIds
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function updateRoles(User $actor, User $user, array $roleIds): void
    {
        $roles = $this->rolesForAssignment()->whereIn('id', $roleIds);
        $assignsSuperAdmin = $roles->contains('code', UserRole::SuperAdmin->value);

        if ($assignsSuperAdmin && ! $actor->hasRole(UserRole::SuperAdmin)) {
            throw new AuthorizationException('Only Super Admins may assign the Super Admin role.');
        }

        if (
            $user->hasRole(UserRole::SuperAdmin)
            && ! $assignsSuperAdmin
            && $this->users->superAdminCount() <= 1
        ) {
            throw ValidationException::withMessages([
                'roles' => __('At least one Super Admin must remain assigned.'),
            ]);
        }

        if ($roles->isEmpty()) {
            throw ValidationException::withMessages([
                'roles' => __('Select at least one role.'),
            ]);
        }

        $this->users->syncRoles($user, $roles->modelKeys());
    }
}
