<?php

namespace App\Enums;

enum CaseStatus: string
{
    case New = 'new';
    case Assigned = 'assigned';
    case InProgress = 'in_progress';
    case PendingInformation = 'pending_information';
    case Escalated = 'escalated';
    case Resolved = 'resolved';
    case Closed = 'closed';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Assigned => 'Assigned',
            self::InProgress => 'In Progress',
            self::PendingInformation => 'Pending Information',
            self::Escalated => 'Escalated',
            self::Resolved => 'Resolved',
            self::Closed => 'Closed',
            self::Rejected => 'Rejected',
        };
    }

    public function canTransitionTo(self $status): bool
    {
        if ($this === $status) {
            return true;
        }

        return in_array($status, $this->allowedTransitions(), true);
    }

    /**
     * @return array<int, self>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::New => [self::Assigned, self::InProgress, self::Rejected],
            self::Assigned => [self::InProgress, self::Escalated, self::Rejected],
            self::InProgress => [self::PendingInformation, self::Escalated, self::Resolved, self::Rejected],
            self::PendingInformation => [self::InProgress, self::Escalated, self::Rejected],
            self::Escalated => [self::Assigned, self::InProgress, self::Resolved, self::Rejected],
            self::Resolved => [self::Closed, self::InProgress],
            self::Closed, self::Rejected => [],
        };
    }
}
