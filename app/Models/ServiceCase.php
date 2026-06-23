<?php

namespace App\Models;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\CaseStatus;
use Database\Factories\ServiceCaseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $case_number
 * @property string $title
 * @property string $description
 * @property int $complaint_type_id
 * @property CaseChannel $channel
 * @property CasePriority $priority
 * @property CaseStatus $status
 * @property int $region_id
 * @property int|null $submitted_by
 * @property int|null $assigned_to
 * @property int|null $created_by_agent
 * @property int $escalation_level
 * @property Carbon|null $due_date
 * @property Carbon|null $closed_at
 * @property string|null $resolution_notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'case_number',
    'title',
    'description',
    'complaint_type_id',
    'channel',
    'priority',
    'status',
    'region_id',
    'submitted_by',
    'assigned_to',
    'created_by_agent',
    'escalation_level',
    'due_date',
    'closed_at',
    'resolution_notes',
])]
class ServiceCase extends Model
{
    /** @use HasFactory<ServiceCaseFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'cases';

    /**
     * @return BelongsTo<ComplaintType, $this>
     */
    public function complaintType(): BelongsTo
    {
        return $this->belongsTo(ComplaintType::class);
    }

    /**
     * @return BelongsTo<Region, $this>
     */
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_agent');
    }

    /**
     * @return HasMany<CaseTimeline, $this>
     */
    public function timelines(): HasMany
    {
        return $this->hasMany(CaseTimeline::class)->oldest();
    }

    public function isOverdue(): bool
    {
        return $this->due_date !== null
            && $this->closed_at === null
            && $this->due_date->isPast();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'channel' => CaseChannel::class,
            'priority' => CasePriority::class,
            'status' => CaseStatus::class,
            'due_date' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }
}
