<?php

namespace App\Models;

use Database\Factories\ContactFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $mobile_number
 * @property string|null $phone_number
 * @property string|null $email
 * @property string|null $organization
 * @property string|null $position
 * @property string|null $notes
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable(['name', 'mobile_number', 'phone_number', 'email', 'organization', 'position', 'notes', 'is_active'])]
class Contact extends Model
{
    /** @use HasFactory<ContactFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return BelongsToMany<ContactGroup, $this>
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(ContactGroup::class)->withTimestamps();
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
