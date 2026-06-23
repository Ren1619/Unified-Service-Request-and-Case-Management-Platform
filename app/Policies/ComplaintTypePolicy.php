<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ComplaintType;
use App\Models\User;

class ComplaintTypePolicy
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

    public function view(User $user, ComplaintType $complaintType): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->manage($user);
    }

    public function update(User $user, ComplaintType $complaintType): bool
    {
        return $this->manage($user);
    }

    public function delete(User $user, ComplaintType $complaintType): bool
    {
        return $this->manage($user);
    }

    public function restore(User $user, ComplaintType $complaintType): bool
    {
        return $this->manage($user);
    }

    public function forceDelete(User $user, ComplaintType $complaintType): bool
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
