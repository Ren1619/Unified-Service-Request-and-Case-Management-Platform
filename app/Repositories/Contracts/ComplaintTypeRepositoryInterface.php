<?php

namespace App\Repositories\Contracts;

use App\Models\ComplaintType;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ComplaintTypeRepositoryInterface
{
    /**
     * @param  array{search?: string|null, status?: string|null}  $filters
     * @return LengthAwarePaginator<int, ComplaintType>
     */
    public function paginateForIndex(array $filters): LengthAwarePaginator;

    /**
     * @param  array{name: string, description?: string|null, is_active?: bool}  $attributes
     */
    public function create(array $attributes): ComplaintType;

    /**
     * @param  array{name?: string, description?: string|null, is_active?: bool}  $attributes
     */
    public function update(ComplaintType $complaintType, array $attributes): ComplaintType;

    public function delete(ComplaintType $complaintType): void;
}
