<?php

namespace App\Http\Requests;

use App\Models\ContactGroup;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('group')) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        /** @var ContactGroup $group */
        $group = $this->route('group');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('contact_groups', 'name')->ignore($group)],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['sometimes', 'boolean'],
            'contact_ids' => ['nullable', 'array'],
            'contact_ids.*' => ['integer', Rule::exists('contacts', 'id')],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function groupData(): array
    {
        $validated = $this->validated();
        unset($validated['contact_ids']);

        return [
            ...$validated,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ];
    }

    /**
     * @return array<int, int>
     */
    public function contactIds(): array
    {
        return array_map('intval', $this->validated('contact_ids', []));
    }
}
