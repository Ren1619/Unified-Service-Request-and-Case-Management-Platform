<?php

namespace App\Enums;

enum CaseChannel: string
{
    case Message = 'message';
    case Call = 'call';

    public function label(): string
    {
        return match ($this) {
            self::Message => 'Message',
            self::Call => 'Call',
        };
    }

    /**
     * @return array<int, self>
     */
    public static function intakeSources(): array
    {
        return [
            self::Message,
            self::Call,
        ];
    }
}
