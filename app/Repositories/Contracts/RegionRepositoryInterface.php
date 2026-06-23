<?php

namespace App\Repositories\Contracts;

use App\Models\Region;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface RegionRepositoryInterface
{
    /**
     * @param  array{search?: string|null, status?: string|null}  $filters
     * @return LengthAwarePaginator<int, Region>
     */
    public function paginateForIndex(array $filters): LengthAwarePaginator;

    /**
     * @param  array{code: string, name: string, description?: string|null, is_active?: bool}  $attributes
     */
    public function create(array $attributes): Region;

    /**
     * @param  array{code?: string, name?: string, description?: string|null, is_active?: bool}  $attributes
     */
    public function update(Region $region, array $attributes): Region;

    public function delete(Region $region): void;
}
