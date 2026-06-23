<?php

namespace App\Repositories\Contracts;

use App\Models\ServiceCase;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CaseRepositoryInterface
{
    /**
     * @param  array{search?: string|null, status?: string|null, priority?: string|null, region_id?: string|null, assigned_to?: string|null}  $filters
     * @return LengthAwarePaginator<int, ServiceCase>
     */
    public function paginateForIndex(array $filters, User $user): LengthAwarePaginator;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): ServiceCase;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(ServiceCase $case, array $attributes): ServiceCase;
}
