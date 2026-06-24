<?php

namespace Tests\Feature;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\CaseStatus;
use App\Models\ComplaintType;
use App\Models\Contact;
use App\Models\ContactGroup;
use App\Models\Region;
use App\Models\ServiceCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $region = Region::factory()->create([
            'code' => 'NCR',
            'name' => 'National Capital Region',
        ]);
        $complaintType = ComplaintType::factory()->create([
            'name' => 'Water Service',
        ]);

        ServiceCase::factory()->create([
            'complaint_type_id' => $complaintType->id,
            'region_id' => $region->id,
            'priority' => CasePriority::High,
            'status' => CaseStatus::InProgress,
            'channel' => CaseChannel::Call,
            'due_date' => now()->subDay(),
        ]);
        ServiceCase::factory()->create([
            'complaint_type_id' => $complaintType->id,
            'region_id' => $region->id,
            'priority' => CasePriority::Medium,
            'status' => CaseStatus::Closed,
            'closed_at' => now(),
        ]);
        Contact::factory()->create();
        ContactGroup::factory()->create();

        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('metrics.cases.total', 2)
                ->where('metrics.cases.open', 1)
                ->where('metrics.cases.overdue', 1)
                ->where('metrics.cases.resolvedThisMonth', 1)
                ->where('metrics.directory.contacts', 1)
                ->where('metrics.directory.groups', 1)
                ->has('statusBreakdown')
                ->has('priorityBreakdown')
                ->has('channelBreakdown')
                ->where('topRegions.0.code', 'NCR')
                ->where('topRegions.0.total', 2)
                ->where('topComplaintTypes.0.name', 'Water Service')
                ->has('recentCases', 2)
            );
    }
}
