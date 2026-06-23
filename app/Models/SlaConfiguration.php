<?php

namespace App\Models;

use App\Enums\CasePriority;
use Database\Factories\SlaConfigurationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property CasePriority $priority
 * @property int $days
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable(['priority', 'days', 'is_active'])]
class SlaConfiguration extends Model
{
    /** @use HasFactory<SlaConfigurationFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'priority' => CasePriority::class,
            'is_active' => 'boolean',
        ];
    }
}
