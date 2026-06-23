<?php

namespace App\Enums;

enum CasePriority: string
{
    case Low = 'low';
    case Medium = 'medium';
    case High = 'high';
    case Critical = 'critical';

    public function label(): string
    {
        return match ($this) {
            self::Low => 'Low',
            self::Medium => 'Medium',
            self::High => 'High',
            self::Critical => 'Critical',
        };
    }

    public function defaultSlaDays(): int
    {
        return match ($this) {
            self::Low => 7,
            self::Medium => 5,
            self::High => 3,
            self::Critical => 1,
        };
    }
}
