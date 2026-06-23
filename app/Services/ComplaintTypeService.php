<?php

namespace App\Services;

use App\Models\ComplaintType;
use App\Repositories\Contracts\ComplaintTypeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ComplaintTypeService
{
    public function __construct(private readonly ComplaintTypeRepositoryInterface $complaintTypes) {}

    /**
     * @param  array{search?: string|null, status?: string|null}  $filters
     * @return LengthAwarePaginator<int, ComplaintType>
     */
    public function paginateForIndex(array $filters): LengthAwarePaginator
    {
        return $this->complaintTypes->paginateForIndex($filters);
    }

    /**
     * @param  array{name: string, description?: string|null, is_active?: bool}  $attributes
     */
    public function create(array $attributes): ComplaintType
    {
        return $this->complaintTypes->create($attributes);
    }

    /**
     * @param  array{name?: string, description?: string|null, is_active?: bool}  $attributes
     */
    public function update(ComplaintType $complaintType, array $attributes): ComplaintType
    {
        return $this->complaintTypes->update($complaintType, $attributes);
    }

    public function delete(ComplaintType $complaintType): void
    {
        $this->complaintTypes->delete($complaintType);
    }
}
