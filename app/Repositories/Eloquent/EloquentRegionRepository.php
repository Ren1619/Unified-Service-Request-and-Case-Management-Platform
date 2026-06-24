<?php

namespace App\Repositories\Eloquent;

use App\Models\Region;
use App\Repositories\Contracts\RegionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentRegionRepository implements RegionRepositoryInterface
{
    public function paginateForIndex(array $filters): LengthAwarePaginator
    {
        return Region::query()
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(($filters['status'] ?? null) === 'active', fn ($query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn ($query) => $query->where('is_active', false))
            ->orderedForDisplay()
            ->paginate(10)
            ->withQueryString();
    }

    public function create(array $attributes): Region
    {
        return Region::query()->create($attributes);
    }

    public function update(Region $region, array $attributes): Region
    {
        $region->update($attributes);

        return $region->refresh();
    }

    public function delete(Region $region): void
    {
        $region->delete();
    }
}
