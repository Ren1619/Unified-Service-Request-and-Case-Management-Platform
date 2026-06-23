<?php

namespace App\Repositories\Contracts;

use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserAccessRepositoryInterface
{
    /**
     * @param  array{search?: string|null, role?: string|null}  $filters
     * @return LengthAwarePaginator<int, User>
     */
    public function paginateForIndex(array $filters): LengthAwarePaginator;

    /**
     * @return Collection<int, Role>
     */
    public function rolesForAssignment(): Collection;

    /**
     * @param  array<int, int>  $roleIds
     */
    public function syncRoles(User $user, array $roleIds): void;

    public function superAdminCount(): int;
}
