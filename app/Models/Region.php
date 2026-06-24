<?php

namespace App\Models;

use Database\Factories\RegionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable(['code', 'name', 'description', 'is_active'])]
class Region extends Model
{
    /** @use HasFactory<RegionFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @var array<int, string>
     */
    public const DISPLAY_ORDER = [
        'R1',
        'R2',
        'R3',
        'R4A',
        'R4B',
        'R5',
        'NCR',
        'CAR',
        'R6',
        'R7',
        'R8',
        'NIR',
        'R9',
        'R10',
        'R11',
        'R12',
        'R13',
        'BARMM',
    ];

    public function scopeOrderedForDisplay(Builder $query): Builder
    {
        return $query
            ->orderByRaw(self::displayOrderSql(), self::displayOrderBindings())
            ->orderBy('name');
    }

    public static function displayOrderSql(string $column = 'code'): string
    {
        $cases = collect(self::DISPLAY_ORDER)
            ->map(fn (string $code, int $index): string => "when ? then {$index}")
            ->implode(' ');

        return "case {$column} {$cases} else ? end";
    }

    /**
     * @return array<int, string|int>
     */
    public static function displayOrderBindings(): array
    {
        return [
            ...self::DISPLAY_ORDER,
            count(self::DISPLAY_ORDER),
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
