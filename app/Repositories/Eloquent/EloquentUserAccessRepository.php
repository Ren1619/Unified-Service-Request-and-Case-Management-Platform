<?php

namespace App\Repositories\Eloquent;

use App\Enums\UserRole;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\UserAccessRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EloquentUserAccessRepository implements UserAccessRepositoryInterface
{
    public function paginateForIndex(array $filters): LengthAwarePaginator
    {
        return User::query()
            ->with('roles')
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, function ($query, string $role): void {
                $query->whereHas('roles', fn ($query) => $query->where('code', $role));
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();
    }

    public function rolesForAssignment(): Collection
    {
        return Role::query()
            ->orderBy('name')
            ->get();
    }

    public function syncRoles(User $user, array $roleIds): void
    {
        $user->roles()->sync($roleIds);
    }

    public function superAdminCount(): int
    {
        return User::query()
            ->whereHas('roles', fn ($query) => $query->where('code', UserRole::SuperAdmin->value))
            ->count();
    }
}
