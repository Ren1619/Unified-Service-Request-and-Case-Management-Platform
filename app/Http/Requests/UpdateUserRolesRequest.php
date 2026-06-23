<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRolesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('user')) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['integer', Rule::exists('roles', 'id')],
        ];
    }

    /**
     * @return array<int, int>
     */
    public function roleIds(): array
    {
        return array_values(array_map(
            fn (mixed $roleId): int => (int) $roleId,
            $this->validated('roles'),
        ));
    }

    public function targetUser(): User
    {
        /** @var User $user */
        $user = $this->route('user');

        return $user;
    }
}
