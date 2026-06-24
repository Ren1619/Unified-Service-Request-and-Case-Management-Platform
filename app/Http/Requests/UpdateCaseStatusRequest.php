<?php

namespace App\Http\Requests;

use App\Enums\CaseStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCaseStatusRequest extends FormRequest
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
            'status' => ['required', Rule::enum(CaseStatus::class)],
        ];
    }

    public function status(): CaseStatus
    {
        return CaseStatus::from($this->string('status')->toString());
    }
}
