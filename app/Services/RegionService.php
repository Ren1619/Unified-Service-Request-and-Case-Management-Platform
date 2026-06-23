<?php

namespace App\Services;

use App\Models\Region;
use App\Repositories\Contracts\RegionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RegionService
{
    public function __construct(private readonly RegionRepositoryInterface $regions) {}

    /**
     * @param  array{search?: string|null, status?: string|null}  $filters
     * @return LengthAwarePaginator<int, Region>
     */
    public function paginateForIndex(array $filters): LengthAwarePaginator
    {
        return $this->regions->paginateForIndex($filters);
    }

    /**
     * @param  array{code: string, name: string, description?: string|null, is_active?: bool}  $attributes
     */
    public function create(array $attributes): Region
    {
        return $this->regions->create($attributes);
    }

    /**
     * @param  array{code?: string, name?: string, description?: string|null, is_active?: bool}  $attributes
     */
    public function update(Region $region, array $attributes): Region
    {
        return $this->regions->update($region, $attributes);
    }

    public function delete(Region $region): void
    {
        $this->regions->delete($region);
    }
}
