<?php

namespace Tests\Feature;

use App\Enums\CaseStatus;
use App\Enums\UserRole;
use App\Models\CaseTimeline;
use App\Models\Contact;
use App\Models\ContactGroup;
use App\Models\Role;
use App\Models\ServiceCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SummaryPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_citizens_cannot_view_summary(): void
    {
        $this->actingAs($this->userWithRole(UserRole::Citizen))
            ->get(route('summary.index'))
            ->assertForbidden();
    }

    public function test_citizens_cannot_export_summary(): void
    {
        $this->actingAs($this->userWithRole(UserRole::Citizen))
            ->get(route('summary.export.overview'))
            ->assertForbidden();
    }

    public function test_supervisors_can_view_audit_summary(): void
    {
        $supervisor = $this->userWithRole(UserRole::Supervisor);
        $openCase = ServiceCase::factory()->create([
            'status' => CaseStatus::InProgress,
            'created_by_agent' => $supervisor,
        ]);
        ServiceCase::factory()->create(['status' => CaseStatus::Resolved]);
        Contact::factory()->count(2)->create();
        ContactGroup::factory()->create();

        CaseTimeline::factory()->create([
            'service_case_id' => $openCase,
            'event' => 'case_created',
            'description' => 'Complaint captured from SMS.',
            'created_by' => $supervisor,
        ]);

        $this->actingAs($supervisor)
            ->get(route('summary.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('summary/index')
                ->where('metrics.complaints.total', 2)
                ->where('metrics.complaints.open', 1)
                ->where('metrics.complaints.resolved', 1)
                ->where('metrics.contacts', 2)
                ->where('metrics.groups', 1)
                ->has('statusBreakdown')
                ->has('recentActivity', 1)
                ->where('recentActivity.0.event', 'case_created')
            );
    }

    public function test_supervisors_can_export_summary_csvs(): void
    {
        $supervisor = $this->userWithRole(UserRole::Supervisor);
        $case = ServiceCase::factory()->create([
            'case_number' => 'CASE-2026-0001',
            'title' => 'Water interruption',
            'status' => CaseStatus::Resolved,
            'created_by_agent' => $supervisor,
        ]);

        Contact::factory()->create();
        ContactGroup::factory()->create();
        CaseTimeline::factory()->create([
            'service_case_id' => $case,
            'event' => 'case_resolved',
            'description' => 'Resolution notes captured.',
            'created_by' => $supervisor,
        ]);

        $overview = $this->actingAs($supervisor)
            ->get(route('summary.export.overview'))
            ->assertOk()
            ->assertDownload('summary-overview.csv');

        $this->assertStringContainsString('"Total complaints",1', $overview->streamedContent());

        $status = $this->actingAs($supervisor)
            ->get(route('summary.export.status'))
            ->assertOk()
            ->assertDownload('summary-status-breakdown.csv');

        $this->assertStringContainsString('Resolved,1', $status->streamedContent());

        $activity = $this->actingAs($supervisor)
            ->get(route('summary.export.activity'))
            ->assertOk()
            ->assertDownload('summary-recent-activity.csv');

        $activityContent = $activity->streamedContent();

        $this->assertStringContainsString('CASE-2026-0001', $activityContent);
        $this->assertStringContainsString('case resolved', $activityContent);
    }

    private function userWithRole(UserRole $role): User
    {
        $user = User::factory()->create();
        $user->roles()->attach($this->role($role));

        return $user;
    }

    private function role(UserRole $role): Role
    {
        return Role::query()->firstOrCreate(
            ['code' => $role->value],
            [
                'name' => $role->label(),
                'description' => "System role for {$role->label()} users.",
                'is_system' => true,
            ],
        );
    }
}
