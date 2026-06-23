<?php

namespace App\Http\Requests;

use App\Models\ComplaintType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateComplaintTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('complaint_type')) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        /** @var ComplaintType $complaintType */
        $complaintType = $this->route('complaint_type');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('complaint_types', 'name')->ignore($complaintType)],
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
