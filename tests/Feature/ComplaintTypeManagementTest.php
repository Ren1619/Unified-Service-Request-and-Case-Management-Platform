<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\ComplaintType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComplaintTypeManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_guests_are_redirected_from_complaint_types(): void
    {
        $this->get(route('complaint-types.index'))
            ->assertRedirect(route('login'));
    }

    public function test_citizens_cannot_view_complaint_type_management(): void
    {
        $this->actingAs($this->userWithRole(UserRole::Citizen))
            ->get(route('complaint-types.index'))
            ->assertForbidden();
    }

    public function test_authorized_users_can_view_complaint_types(): void
    {
        ComplaintType::factory()->create(['name' => 'Technical Issue']);

        $this->actingAs($this->userWithRole(UserRole::CentralAdministrator))
            ->get(route('complaint-types.index'))
            ->assertOk()
            ->assertSee('complaint-types\\/index', false);
    }

    public function test_central_administrators_can_create_update_and_archive_complaint_types(): void
    {
        $user = $this->userWithRole(UserRole::CentralAdministrator);

        $this->actingAs($user)
            ->post(route('complaint-types.store'), [
                'name' => 'Technical Issue',
                'description' => 'Platform or access issue.',
                'is_active' => true,
            ])
            ->assertRedirect(route('complaint-types.index'));

        $complaintType = ComplaintType::query()->where('name', 'Technical Issue')->firstOrFail();

        $this->assertModelExists($complaintType);

        $this->actingAs($user)
            ->put(route('complaint-types.update', $complaintType), [
                'name' => 'Technical Concern',
                'description' => 'Updated description.',
                'is_active' => false,
            ])
            ->assertRedirect(route('complaint-types.show', $complaintType));

        $this->assertFalse($complaintType->refresh()->is_active);
        $this->assertSame('Technical Concern', $complaintType->name);

        $this->actingAs($user)
            ->delete(route('complaint-types.destroy', $complaintType))
            ->assertRedirect(route('complaint-types.index'));

        $this->assertSoftDeleted($complaintType);
    }

    public function test_complaint_type_validation_requires_unique_names(): void
    {
        ComplaintType::factory()->create(['name' => 'Billing Concern']);

        $this->actingAs($this->userWithRole(UserRole::SuperAdmin))
            ->from(route('complaint-types.create'))
            ->post(route('complaint-types.store'), [
                'name' => 'Billing Concern',
                'description' => null,
                'is_active' => true,
            ])
            ->assertRedirect(route('complaint-types.create'))
            ->assertSessionHasErrors('name');
    }

    private function userWithRole(UserRole $role): User
    {
        $roleModel = Role::query()->create([
            'code' => $role->value,
            'name' => $role->label(),
            'is_system' => true,
        ]);

        $user = User::factory()->create();
        $user->roles()->attach($roleModel);

        return $user;
    }
}
