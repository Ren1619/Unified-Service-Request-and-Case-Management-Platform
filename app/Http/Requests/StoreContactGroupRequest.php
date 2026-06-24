<?php

namespace App\Http\Requests;

use App\Models\ContactGroup;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', ContactGroup::class) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('contact_groups', 'name')],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['sometimes', 'boolean'],
            'contact_ids' => ['nullable', 'array'],
            'contact_ids.*' => ['integer', Rule::exists('contacts', 'id')->where('is_active', true)],
            'redirect_to' => ['nullable', 'string', Rule::in(['index'])],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function groupData(): array
    {
        $validated = $this->validated();
        unset($validated['contact_ids']);
        unset($validated['redirect_to']);

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
