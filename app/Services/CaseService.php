<?php

namespace App\Services;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\CaseStatus;
use App\Models\Region;
use App\Models\ServiceCase;
use App\Models\SlaConfiguration;
use App\Models\User;
use App\Repositories\Contracts\CaseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CaseService
{
    public function __construct(private readonly CaseRepositoryInterface $cases) {}

    /**
     * @param  array{search?: string|null, status?: string|null, priority?: string|null, region_id?: string|null, assigned_to?: string|null}  $filters
     * @return LengthAwarePaginator<int, ServiceCase>
     */
    public function paginateForIndex(array $filters, User $user): LengthAwarePaginator
    {
        return $this->cases->paginateForIndex($filters, $user);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes, User $actor): ServiceCase
    {
        return DB::transaction(function () use ($attributes, $actor): ServiceCase {
            $region = Region::query()->findOrFail($attributes['region_id']);
            $priority = CasePriority::from((string) $attributes['priority']);
            $channel = CaseChannel::from((string) $attributes['channel']);
            $assignedTo = $attributes['assigned_to'] ?? null;

            $case = $this->cases->create([
                'case_number' => $this->generateCaseNumber($region),
                'title' => $attributes['title'],
                'description' => $attributes['description'],
                'complaint_type_id' => $attributes['complaint_type_id'],
                'channel' => $channel,
                'priority' => $priority,
                'status' => $assignedTo ? CaseStatus::Assigned : CaseStatus::New,
                'region_id' => $region->id,
                'submitted_by' => $this->submittedBy($attributes),
                'assigned_to' => $assignedTo,
                'created_by_agent' => $actor->id,
                'escalation_level' => 0,
                'due_date' => Date::now()->addDays($this->slaDays($priority)),
                'closed_at' => null,
                'resolution_notes' => null,
            ]);

            $this->recordTimeline($case, 'case_created', 'Case created.', null, $this->timelineValues($case), $actor);

            if ($assignedTo) {
                $this->recordTimeline($case, 'assigned', 'Case assigned.', null, ['assigned_to' => $assignedTo], $actor);
            }

            return $case;
        });
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(ServiceCase $case, array $attributes, User $actor): ServiceCase
    {
        return DB::transaction(function () use ($case, $attributes, $actor): ServiceCase {
            $nextStatus = CaseStatus::from((string) $attributes['status']);

            if (! $case->status->canTransitionTo($nextStatus)) {
                throw ValidationException::withMessages([
                    'status' => __('The selected status cannot follow the current case status.'),
                ]);
            }

            $oldValues = $this->timelineValues($case);
            $priority = CasePriority::from((string) $attributes['priority']);
            $assignedTo = $attributes['assigned_to'] ?? null;

            $updated = $this->cases->update($case, [
                'title' => $attributes['title'],
                'description' => $attributes['description'],
                'complaint_type_id' => $attributes['complaint_type_id'],
                'channel' => CaseChannel::from((string) $attributes['channel']),
                'priority' => $priority,
                'status' => $nextStatus,
                'region_id' => $attributes['region_id'],
                'submitted_by' => $attributes['submitted_by'] ?? null,
                'assigned_to' => $assignedTo,
                'created_by_agent' => $attributes['created_by_agent'] ?? $case->created_by_agent,
                'due_date' => $case->priority === $priority ? $case->due_date : Date::now()->addDays($this->slaDays($priority)),
                'closed_at' => $nextStatus === CaseStatus::Closed ? ($case->closed_at ?? Date::now()) : $case->closed_at,
                'resolution_notes' => $attributes['resolution_notes'] ?? null,
            ]);

            $newValues = $this->timelineValues($updated);

            if ($oldValues['status'] !== $newValues['status']) {
                $this->recordTimeline($updated, 'status_updated', 'Case status updated.', ['status' => $oldValues['status']], ['status' => $newValues['status']], $actor);
            }

            if ($oldValues['assigned_to'] !== $newValues['assigned_to']) {
                $this->recordTimeline($updated, $oldValues['assigned_to'] ? 'reassigned' : 'assigned', 'Case assignee updated.', ['assigned_to' => $oldValues['assigned_to']], ['assigned_to' => $newValues['assigned_to']], $actor);
            }

            $this->recordTimeline($updated, 'case_updated', 'Case details updated.', $oldValues, $newValues, $actor);

            return $updated;
        });
    }

    public function updateStatus(ServiceCase $case, CaseStatus $nextStatus, User $actor): ServiceCase
    {
        return DB::transaction(function () use ($case, $nextStatus, $actor): ServiceCase {
            if (! $case->status->canTransitionTo($nextStatus)) {
                throw ValidationException::withMessages([
                    'status' => __('The selected status cannot follow the current case status.'),
                ]);
            }

            if (
                in_array($nextStatus, [CaseStatus::Resolved, CaseStatus::Closed], true)
                && blank($case->resolution_notes)
            ) {
                throw ValidationException::withMessages([
                    'status' => __('Add resolution notes before marking this complaint as resolved or closed.'),
                ]);
            }

            $oldValues = $this->timelineValues($case);

            $updated = $this->cases->update($case, [
                'status' => $nextStatus,
                'closed_at' => $nextStatus === CaseStatus::Closed ? ($case->closed_at ?? Date::now()) : $case->closed_at,
            ]);

            $newValues = $this->timelineValues($updated);

            if ($oldValues['status'] !== $newValues['status']) {
                $this->recordTimeline($updated, 'status_updated', 'Case status updated.', ['status' => $oldValues['status']], ['status' => $newValues['status']], $actor);
            }

            return $updated;
        });
    }

    private function generateCaseNumber(Region $region): string
    {
        $year = Date::now()->format('Y');
        $prefix = "{$year}-{$region->code}-";
        $sequence = ServiceCase::withTrashed()
            ->where('case_number', 'like', "{$prefix}%")
            ->count() + 1;

        return $prefix.str_pad((string) $sequence, 6, '0', STR_PAD_LEFT);
    }

    private function slaDays(CasePriority $priority): int
    {
        return (int) (SlaConfiguration::query()
            ->where('priority', $priority->value)
            ->where('is_active', true)
            ->value('days') ?? $priority->defaultSlaDays());
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function submittedBy(array $attributes): ?int
    {
        return $attributes['submitted_by'] ?? null;
    }

    /**
     * @return array<string, mixed>
     */
    private function timelineValues(ServiceCase $case): array
    {
        return [
            'case_number' => $case->case_number,
            'title' => $case->title,
            'status' => $case->status->value,
            'priority' => $case->priority->value,
            'assigned_to' => $case->assigned_to,
            'region_id' => $case->region_id,
        ];
    }

    /**
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    private function recordTimeline(ServiceCase $case, string $event, ?string $description, ?array $oldValues, ?array $newValues, User $actor): void
    {
        $case->timelines()->create([
            'event' => $event,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'created_by' => $actor->id,
        ]);
    }
}
