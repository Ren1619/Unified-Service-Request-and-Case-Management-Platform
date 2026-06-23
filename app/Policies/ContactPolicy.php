<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Contact;
use App\Models\User;

class ContactPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->useContacts($user);
    }

    public function view(User $user, Contact $contact): bool
    {
        return $this->useContacts($user);
    }

    public function create(User $user): bool
    {
        return $this->useContacts($user);
    }

    public function update(User $user, Contact $contact): bool
    {
        return $this->useContacts($user);
    }

    public function delete(User $user, Contact $contact): bool
    {
        return $this->useContacts($user);
    }

    public function restore(User $user, Contact $contact): bool
    {
        return $this->useContacts($user);
    }

    public function forceDelete(User $user, Contact $contact): bool
    {
        return false;
    }

    private function useContacts(User $user): bool
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
