<?php

namespace Tests\Unit;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\UserRole;
use App\Models\ComplaintType;
use App\Models\Region;
use App\Models\Role;
use App\Models\ServiceCase;
use App\Models\User;
use App\Services\CaseService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CaseServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_region_scoped_case_numbers(): void
    {
        $admin = $this->userWithRole(UserRole::CentralAdministrator);
        $complaintType = ComplaintType::factory()->create();
        $region = Region::factory()->create(['code' => 'NCR']);

        $first = app(CaseService::class)->create([
            'title' => 'First case',
            'description' => 'First case description.',
            'complaint_type_id' => $complaintType->id,
            'region_id' => $region->id,
            'priority' => CasePriority::Low->value,
            'channel' => CaseChannel::SelfService->value,
        ], $admin);

        $second = app(CaseService::class)->create([
            'title' => 'Second case',
            'description' => 'Second case description.',
            'complaint_type_id' => $complaintType->id,
            'region_id' => $region->id,
            'priority' => CasePriority::Low->value,
            'channel' => CaseChannel::SelfService->value,
        ], $admin);

        $this->assertStringEndsWith('-NCR-000001', $first->case_number);
        $this->assertStringEndsWith('-NCR-000002', $second->case_number);
    }

    public function test_it_filters_citizens_to_their_own_cases(): void
    {
        $citizen = $this->userWithRole(UserRole::Citizen);
        $otherCitizen = $this->userWithRole(UserRole::Citizen);

        ServiceCase::factory()->create(['submitted_by' => $citizen->id, 'title' => 'Visible']);
        ServiceCase::factory()->create(['submitted_by' => $otherCitizen->id, 'title' => 'Hidden']);

        $cases = app(CaseService::class)->paginateForIndex([], $citizen);

        $this->assertSame(1, $cases->total());
        $this->assertSame('Visible', $cases->items()[0]->title);
    }

    public function test_internal_users_can_filter_cases(): void
    {
        $admin = $this->userWithRole(UserRole::CentralAdministrator);

        ServiceCase::factory()->create([
            'priority' => CasePriority::Critical,
            'title' => 'Critical outage',
        ]);
        ServiceCase::factory()->create([
            'priority' => CasePriority::Low,
            'title' => 'Routine request',
        ]);

        $cases = app(CaseService::class)->paginateForIndex([
            'search' => 'outage',
            'priority' => CasePriority::Critical->value,
        ], $admin);

        $this->assertSame(1, $cases->total());
        $this->assertSame('Critical outage', $cases->items()[0]->title);
    }

    private function userWithRole(UserRole $role): User
    {
        $roleModel = Role::query()->firstOrCreate(
            ['code' => $role->value],
            ['name' => $role->label(), 'is_system' => true],
        );

        $user = User::factory()->create();
        $user->roles()->attach($roleModel);

        return $user;
    }
}
