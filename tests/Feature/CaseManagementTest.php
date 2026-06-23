<?php

namespace Tests\Feature;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\CaseStatus;
use App\Enums\UserRole;
use App\Models\ComplaintType;
use App\Models\Region;
use App\Models\Role;
use App\Models\ServiceCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CaseManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_guests_are_redirected_from_cases(): void
    {
        $this->get(route('cases.index'))
            ->assertRedirect(route('login'));
    }

    public function test_citizens_can_create_self_service_cases(): void
    {
        $citizen = $this->userWithRole(UserRole::Citizen);
        $complaintType = ComplaintType::factory()->create();
        $region = Region::factory()->create(['code' => 'NCR']);

        $this->actingAs($citizen)
            ->post(route('cases.store'), [
                'title' => 'Cannot access portal',
                'description' => 'The portal rejects my account.',
                'complaint_type_id' => $complaintType->id,
                'region_id' => $region->id,
                'priority' => CasePriority::High->value,
                'channel' => CaseChannel::AgentAssisted->value,
            ])
            ->assertRedirect();

        $case = ServiceCase::query()->firstOrFail();

        $this->assertModelExists($case);
        $this->assertSame('new', $case->status->value);
        $this->assertSame('self_service', $case->channel->value);
        $this->assertSame($citizen->id, $case->submitted_by);
        $this->assertStringContainsString('-NCR-000001', $case->case_number);
        $this->assertDatabaseHas('case_timelines', [
            'service_case_id' => $case->id,
            'event' => 'case_created',
        ]);
    }

    public function test_agents_can_create_assigned_cases(): void
    {
        $agent = $this->userWithRole(UserRole::CustomerServiceAgent);
        $officer = $this->userWithRole(UserRole::CaseOfficer);
        $complaintType = ComplaintType::factory()->create();
        $region = Region::factory()->create(['code' => 'CAR']);

        $this->actingAs($agent)
            ->post(route('cases.store'), [
                'title' => 'Billing concern',
                'description' => 'Caller reports a billing discrepancy.',
                'complaint_type_id' => $complaintType->id,
                'region_id' => $region->id,
                'priority' => CasePriority::Medium->value,
                'channel' => CaseChannel::AgentAssisted->value,
                'assigned_to' => $officer->id,
            ])
            ->assertRedirect();

        $case = ServiceCase::query()->firstOrFail();

        $this->assertSame(CaseStatus::Assigned, $case->status);
        $this->assertSame($officer->id, $case->assigned_to);
        $this->assertSame($agent->id, $case->created_by_agent);
    }

    public function test_internal_users_can_update_valid_case_statuses(): void
    {
        $officer = $this->userWithRole(UserRole::CaseOfficer);
        $case = ServiceCase::factory()->create([
            'status' => CaseStatus::Assigned,
            'assigned_to' => $officer->id,
        ]);

        $this->actingAs($officer)
            ->put(route('cases.update', $case), [
                'title' => $case->title,
                'description' => $case->description,
                'complaint_type_id' => $case->complaint_type_id,
                'region_id' => $case->region_id,
                'priority' => $case->priority->value,
                'status' => CaseStatus::InProgress->value,
                'channel' => $case->channel->value,
                'submitted_by' => $case->submitted_by,
                'assigned_to' => $officer->id,
            ])
            ->assertRedirect(route('cases.show', $case));

        $this->assertSame(CaseStatus::InProgress, $case->refresh()->status);
        $this->assertDatabaseHas('case_timelines', [
            'service_case_id' => $case->id,
            'event' => 'status_updated',
        ]);
    }

    public function test_invalid_status_transitions_are_rejected(): void
    {
        $officer = $this->userWithRole(UserRole::CaseOfficer);
        $case = ServiceCase::factory()->create([
            'status' => CaseStatus::New,
            'assigned_to' => $officer->id,
        ]);

        $this->actingAs($officer)
            ->from(route('cases.edit', $case))
            ->put(route('cases.update', $case), [
                'title' => $case->title,
                'description' => $case->description,
                'complaint_type_id' => $case->complaint_type_id,
                'region_id' => $case->region_id,
                'priority' => $case->priority->value,
                'status' => CaseStatus::Closed->value,
                'channel' => $case->channel->value,
                'submitted_by' => $case->submitted_by,
                'assigned_to' => $officer->id,
                'resolution_notes' => 'Closed.',
            ])
            ->assertRedirect(route('cases.edit', $case))
            ->assertSessionHasErrors('status');
    }

    public function test_citizens_cannot_view_other_citizens_cases(): void
    {
        $citizen = $this->userWithRole(UserRole::Citizen);
        $otherCitizen = $this->userWithRole(UserRole::Citizen);
        $case = ServiceCase::factory()->create(['submitted_by' => $otherCitizen->id]);

        $this->actingAs($citizen)
            ->get(route('cases.show', $case))
            ->assertForbidden();
    }

    public function test_central_administrators_can_archive_cases(): void
    {
        $admin = $this->userWithRole(UserRole::CentralAdministrator);
        $case = ServiceCase::factory()->create();

        $this->actingAs($admin)
            ->delete(route('cases.destroy', $case))
            ->assertRedirect(route('cases.index'));

        $this->assertSoftDeleted($case);
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
