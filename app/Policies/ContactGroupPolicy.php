<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ContactGroup;
use App\Models\User;

class ContactGroupPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->useGroups($user);
    }

    public function view(User $user, ContactGroup $group): bool
    {
        return $this->useGroups($user);
    }

    public function create(User $user): bool
    {
        return $this->useGroups($user);
    }

    public function update(User $user, ContactGroup $group): bool
    {
        return $this->useGroups($user);
    }

    public function delete(User $user, ContactGroup $group): bool
    {
        return $this->useGroups($user);
    }

    public function restore(User $user, ContactGroup $group): bool
    {
        return $this->useGroups($user);
    }

    public function forceDelete(User $user, ContactGroup $group): bool
    {
        return false;
    }

    private function useGroups(User $user): bool
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
}
