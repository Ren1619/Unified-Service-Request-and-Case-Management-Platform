<?php

namespace App\Repositories\Eloquent;

use App\Enums\UserRole;
use App\Models\ServiceCase;
use App\Models\User;
use App\Repositories\Contracts\CaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentCaseRepository implements CaseRepositoryInterface
{
    public function paginateForIndex(array $filters, User $user): LengthAwarePaginator
    {
        return ServiceCase::query()
            ->with([
                'assignee:id,name,email',
                'complaintType:id,name',
                'region:id,code,name',
                'submitter:id,name,email',
            ])
            ->when(! $this->isInternalUser($user), fn ($query) => $query->where('submitted_by', $user->id))
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('case_number', 'like', "%{$search}%")
                        ->orWhere('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, fn ($query, string $priority) => $query->where('priority', $priority))
            ->when($filters['region_id'] ?? null, fn ($query, string $regionId) => $query->where('region_id', $regionId))
            ->when($filters['assigned_to'] ?? null, fn ($query, string $assigneeId) => $query->where('assigned_to', $assigneeId))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();
    }

    public function create(array $attributes): ServiceCase
    {
        return ServiceCase::query()->create($attributes);
    }

    public function update(ServiceCase $case, array $attributes): ServiceCase
    {
        $case->update($attributes);

        return $case->refresh();
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
