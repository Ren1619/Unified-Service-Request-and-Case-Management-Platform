<?php

namespace App\Enums;

enum CaseChannel: string
{
    case SelfService = 'self_service';
    case AgentAssisted = 'agent_assisted';

    public function label(): string
    {
        return match ($this) {
            self::SelfService => 'Self-Service',
            self::AgentAssisted => 'Agent-Assisted',
        };
    }
}
