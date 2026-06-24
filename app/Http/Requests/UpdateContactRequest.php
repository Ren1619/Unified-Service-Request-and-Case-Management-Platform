<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('contact')) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'mobile_number' => ['nullable', 'string', 'max:50'],
            'phone_number' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'region_id' => ['nullable', 'integer', Rule::exists('regions', 'id')],
            'notes' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['sometimes', 'boolean'],
            'group_ids' => ['nullable', 'array'],
            'group_ids.*' => ['integer', Rule::exists('contact_groups', 'id')],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function contactData(): array
    {
        $validated = $this->validated();
        unset($validated['group_ids']);

        return [
            ...$validated,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ];
    }

    /**
     * @return array<int, int>
     */
    public function groupIds(): array
    {
        return array_map('intval', $this->validated('group_ids', []));
    }
}
