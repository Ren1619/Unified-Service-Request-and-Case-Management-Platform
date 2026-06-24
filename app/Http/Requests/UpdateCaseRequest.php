<?php

namespace App\Http\Requests;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\CaseStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('case')) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'complaint_type_id' => ['required', 'integer', Rule::exists('complaint_types', 'id')],
            'region_id' => ['required', 'integer', Rule::exists('regions', 'id')],
            'priority' => ['required', Rule::enum(CasePriority::class)],
            'status' => ['required', Rule::enum(CaseStatus::class)],
            'channel' => ['required', Rule::enum(CaseChannel::class)->only(CaseChannel::intakeSources())],
            'submitted_by' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'assigned_to' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'resolution_notes' => [
                Rule::requiredIf(fn (): bool => in_array($this->string('status')->toString(), [
                    CaseStatus::Resolved->value,
                    CaseStatus::Closed->value,
                ], true)),
                'nullable',
                'string',
                'max:5000',
            ],
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
