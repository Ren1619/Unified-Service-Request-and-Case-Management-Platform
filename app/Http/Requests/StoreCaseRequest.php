<?php

namespace App\Http\Requests;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Models\ServiceCase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', ServiceCase::class) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'complaint_type_id' => ['required', 'integer', Rule::exists('complaint_types', 'id')->where('is_active', true)],
            'region_id' => ['required', 'integer', Rule::exists('regions', 'id')->where('is_active', true)],
            'priority' => ['required', Rule::enum(CasePriority::class)],
            'channel' => ['required', Rule::enum(CaseChannel::class)],
            'submitted_by' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'assigned_to' => ['nullable', 'integer', Rule::exists('users', 'id')],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function caseData(): array
    {
        return $this->validated();
    }
}
