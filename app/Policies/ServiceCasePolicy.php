<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ServiceCase;
use App\Models\User;

class ServiceCasePolicy
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
            UserRole::Citizen,
        ]);
    }

    public function view(User $user, ServiceCase $case): bool
    {
        return $this->isInternalUser($user) || $case->submitted_by === $user->id;
    }

    public function create(User $user): bool
    {
        return $this->isInternalUser($user);
    }

    public function update(User $user, ServiceCase $case): bool
    {
        return $this->isInternalUser($user);
    }

    public function delete(User $user, ServiceCase $case): bool
    {
        return $user->hasAnyRole([
            UserRole::SuperAdmin,
            UserRole::CentralAdministrator,
        ]);
    }

    public function restore(User $user, ServiceCase $case): bool
    {
        return $this->delete($user, $case);
    }

    public function forceDelete(User $user, ServiceCase $case): bool
    {
        return false;
    }

    private function isInternalUser(User $user): bool
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
