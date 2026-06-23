<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAccessManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_citizens_cannot_view_user_access(): void
    {
        $this->actingAs($this->userWithRole(UserRole::Citizen))
            ->get(route('users.index'))
            ->assertForbidden();
    }

    public function test_super_admins_can_view_user_access(): void
    {
        $this->actingAs($this->userWithRole(UserRole::SuperAdmin))
            ->get(route('users.index'))
            ->assertOk()
            ->assertSee('users\\/index', false);
    }

    public function test_super_admins_can_update_user_roles(): void
    {
        $superAdmin = $this->userWithRole(UserRole::SuperAdmin);
        $caseOfficerRole = $this->role(UserRole::CaseOfficer);
        $target = $this->userWithRole(UserRole::Citizen);

        $this->actingAs($superAdmin)
            ->put(route('users.update', $target), [
                'roles' => [$caseOfficerRole->id],
            ])
            ->assertRedirect(route('users.show', $target));

        $this->assertTrue($target->fresh()->hasRole(UserRole::CaseOfficer));
        $this->assertFalse($target->fresh()->hasRole(UserRole::Citizen));
    }

    public function test_central_administrators_cannot_assign_super_admin(): void
    {
        $centralAdmin = $this->userWithRole(UserRole::CentralAdministrator);
        $superAdminRole = $this->role(UserRole::SuperAdmin);
        $target = $this->userWithRole(UserRole::Citizen);

        $this->actingAs($centralAdmin)
            ->put(route('users.update', $target), [
                'roles' => [$superAdminRole->id],
            ])
            ->assertForbidden();

        $this->assertFalse($target->fresh()->hasRole(UserRole::SuperAdmin));
    }

    public function test_last_super_admin_role_cannot_be_removed(): void
    {
        $superAdmin = $this->userWithRole(UserRole::SuperAdmin);
        $centralAdminRole = $this->role(UserRole::CentralAdministrator);

        $this->actingAs($superAdmin)
            ->from(route('users.edit', $superAdmin))
            ->put(route('users.update', $superAdmin), [
                'roles' => [$centralAdminRole->id],
            ])
            ->assertRedirect(route('users.edit', $superAdmin))
            ->assertSessionHasErrors('roles');

        $this->assertTrue($superAdmin->fresh()->hasRole(UserRole::SuperAdmin));
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
