<?php

namespace App\Http\Requests;

use App\Models\Region;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRegionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('region')) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        /** @var Region $region */
        $region = $this->route('region');

        return [
            'code' => ['required', 'string', 'max:20', 'alpha_dash:ascii', 'uppercase', Rule::unique('regions', 'code')->ignore($region)],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array{code: string, name: string, description?: string|null, is_active?: bool}
     */
    public function regionData(): array
    {
        $validated = $this->validated();

        return [
            'code' => (string) $validated['code'],
            'name' => (string) $validated['name'],
            'description' => isset($validated['description']) ? (string) $validated['description'] : null,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ];
    }
}
