<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Region;
use App\Models\User;

class RegionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            UserRole::SuperAdmin,
            UserRole::CentralAdministrator,
            UserRole::RegionalAdministrator,
            UserRole::Supervisor,
            UserRole::CustomerServiceAgent,
            UserRole::CaseOfficer,
        ]);
    }

    public function view(User $user, Region $region): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->manage($user);
    }

    public function update(User $user, Region $region): bool
    {
        return $this->manage($user);
    }

    public function delete(User $user, Region $region): bool
    {
        return $this->manage($user);
    }

    public function restore(User $user, Region $region): bool
    {
        return $this->manage($user);
    }

    public function forceDelete(User $user, Region $region): bool
    {
        return false;
    }

    private function manage(User $user): bool
    {
        return $user->hasAnyRole([
            UserRole::SuperAdmin,
            UserRole::CentralAdministrator,
        ]);
    }
}
