<?php

namespace App\Repositories\Eloquent;

use App\Models\ComplaintType;
use App\Repositories\Contracts\ComplaintTypeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentComplaintTypeRepository implements ComplaintTypeRepositoryInterface
{
    public function paginateForIndex(array $filters): LengthAwarePaginator
    {
        return ComplaintType::query()
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'active', fn ($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn ($query) => $query->where('is_active', false))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();
    }

    public function create(array $attributes): ComplaintType
    {
        return ComplaintType::query()->create($attributes);
    }

    public function update(ComplaintType $complaintType, array $attributes): ComplaintType
    {
        $complaintType->update($attributes);

        return $complaintType->refresh();
    }

    public function delete(ComplaintType $complaintType): void
    {
        $complaintType->delete();
    }
}
