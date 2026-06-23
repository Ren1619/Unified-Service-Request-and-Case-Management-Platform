<?php

namespace App\Models;

use Database\Factories\CaseTimelineFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $service_case_id
 * @property string $event
 * @property string|null $description
 * @property array<string, mixed>|null $old_values
 * @property array<string, mixed>|null $new_values
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['service_case_id', 'event', 'description', 'old_values', 'new_values', 'created_by'])]
class CaseTimeline extends Model
{
    /** @use HasFactory<CaseTimelineFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<ServiceCase, $this>
     */
    public function serviceCase(): BelongsTo
    {
        return $this->belongsTo(ServiceCase::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
        ];
    }
}
