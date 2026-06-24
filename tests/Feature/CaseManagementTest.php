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
use Inertia\Testing\AssertableInertia as Assert;
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

    public function test_citizens_cannot_create_cases(): void
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
                'channel' => CaseChannel::Message->value,
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('cases', 0);
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
                'channel' => CaseChannel::Call->value,
                'assigned_to' => $officer->id,
            ])
            ->assertRedirect();

        $case = ServiceCase::query()->firstOrFail();

        $this->assertSame(CaseStatus::Assigned, $case->status);
        $this->assertSame(CaseChannel::Call, $case->channel);
        $this->assertSame($officer->id, $case->assigned_to);
        $this->assertSame($agent->id, $case->created_by_agent);
        $this->assertNull($case->submitted_by);
    }

    public function test_case_forms_list_regions_in_display_order(): void
    {
        Region::factory()->create(['code' => 'R5', 'name' => 'Bicol Region']);
        Region::factory()->create(['code' => 'R1', 'name' => 'Ilocos Region']);
        Region::factory()->create(['code' => 'NCR', 'name' => 'National Capital Region']);

        $this->actingAs($this->userWithRole(UserRole::CustomerServiceAgent))
            ->get(route('cases.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('cases/create')
                ->where('options.regions.0.code', 'R1')
                ->where('options.regions.1.code', 'R5')
                ->where('options.regions.2.code', 'NCR')
            );
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

    public function test_internal_users_can_quick_update_case_statuses(): void
    {
        $officer = $this->userWithRole(UserRole::CaseOfficer);
        $case = ServiceCase::factory()->create([
            'status' => CaseStatus::Assigned,
            'assigned_to' => $officer->id,
        ]);

        $this->actingAs($officer)
            ->from(route('cases.index'))
            ->patch(route('cases.status', $case), [
                'status' => CaseStatus::InProgress->value,
            ])
            ->assertRedirect(route('cases.index'));

        $this->assertSame(CaseStatus::InProgress, $case->refresh()->status);
        $this->assertDatabaseHas('case_timelines', [
            'service_case_id' => $case->id,
            'event' => 'status_updated',
        ]);
    }

    public function test_quick_status_update_rejects_invalid_transitions(): void
    {
        $officer = $this->userWithRole(UserRole::CaseOfficer);
        $case = ServiceCase::factory()->create([
            'status' => CaseStatus::New,
            'assigned_to' => $officer->id,
        ]);

        $this->actingAs($officer)
            ->from(route('cases.index'))
            ->patch(route('cases.status', $case), [
                'status' => CaseStatus::Closed->value,
            ])
            ->assertRedirect(route('cases.index'))
            ->assertSessionHasErrors('status');

        $this->assertSame(CaseStatus::New, $case->refresh()->status);
    }

    public function test_citizens_cannot_quick_update_case_statuses(): void
    {
        $citizen = $this->userWithRole(UserRole::Citizen);
        $case = ServiceCase::factory()->create([
            'submitted_by' => $citizen->id,
            'status' => CaseStatus::Assigned,
        ]);

        $this->actingAs($citizen)
            ->patch(route('cases.status', $case), [
                'status' => CaseStatus::InProgress->value,
            ])
            ->assertForbidden();

        $this->assertSame(CaseStatus::Assigned, $case->refresh()->status);
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
