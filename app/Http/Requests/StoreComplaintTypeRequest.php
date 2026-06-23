<?php

namespace App\Http\Requests;

use App\Models\ComplaintType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreComplaintTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', ComplaintType::class) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('complaint_types', 'name')],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array{name: string, description?: string|null, is_active?: bool}
     */
    public function complaintTypeData(): array
    {
        $validated = $this->validated();

        return [
            'name' => (string) $validated['name'],
            'description' => isset($validated['description']) ? (string) $validated['description'] : null,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ];
    }
}
