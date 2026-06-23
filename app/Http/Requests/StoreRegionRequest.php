<?php

namespace App\Http\Requests;

use App\Models\Region;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRegionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Region::class) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:20', 'alpha_dash:ascii', 'uppercase', Rule::unique('regions', 'code')],
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
