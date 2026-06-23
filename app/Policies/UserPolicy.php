<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->manageAccess($user);
    }

    public function view(User $user, User $target): bool
    {
        return $this->manageAccess($user);
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, User $target): bool
    {
        if ($user->hasRole(UserRole::SuperAdmin)) {
            return true;
        }

        return $user->hasRole(UserRole::CentralAdministrator)
            && ! $target->hasRole(UserRole::SuperAdmin);
    }

    public function delete(User $user, User $target): bool
    {
        return false;
    }

    public function restore(User $user, User $target): bool
    {
        return false;
    }

    public function forceDelete(User $user, User $target): bool
    {
        return false;
    }

    private function manageAccess(User $user): bool
    {
        return $user->hasAnyRole([
            UserRole::SuperAdmin,
            UserRole::CentralAdministrator,
        ]);
    }
}
