<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Region;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_guests_are_redirected_from_regions(): void
    {
        $this->get(route('regions.index'))
            ->assertRedirect(route('login'));
    }

    public function test_citizens_cannot_view_region_management(): void
    {
        $this->actingAs($this->userWithRole(UserRole::Citizen))
            ->get(route('regions.index'))
            ->assertForbidden();
    }

    public function test_authorized_users_can_view_regions(): void
    {
        Region::factory()->create(['name' => 'National Capital Region', 'code' => 'NCR']);

        $this->actingAs($this->userWithRole(UserRole::CentralAdministrator))
            ->get(route('regions.index'))
            ->assertOk()
            ->assertSee('regions\\/index', false);
    }

    public function test_central_administrators_can_create_update_and_archive_regions(): void
    {
        $user = $this->userWithRole(UserRole::CentralAdministrator);

        $this->actingAs($user)
            ->post(route('regions.store'), [
                'code' => 'NCR',
                'name' => 'National Capital Region',
                'description' => 'Main service region.',
                'is_active' => true,
            ])
            ->assertRedirect(route('regions.index'));

        $region = Region::query()->where('code', 'NCR')->firstOrFail();

        $this->assertModelExists($region);

        $this->actingAs($user)
            ->put(route('regions.update', $region), [
                'code' => 'NCR',
                'name' => 'NCR Updated',
                'description' => 'Updated description.',
                'is_active' => false,
            ])
            ->assertRedirect(route('regions.show', $region));

        $this->assertFalse($region->refresh()->is_active);
        $this->assertSame('NCR Updated', $region->name);

        $this->actingAs($user)
            ->delete(route('regions.destroy', $region))
            ->assertRedirect(route('regions.index'));

        $this->assertSoftDeleted($region);
    }

    public function test_region_validation_requires_unique_codes(): void
    {
        Region::factory()->create(['code' => 'NCR']);

        $this->actingAs($this->userWithRole(UserRole::SuperAdmin))
            ->from(route('regions.create'))
            ->post(route('regions.store'), [
                'code' => 'NCR',
                'name' => 'Duplicate Region',
                'description' => null,
                'is_active' => true,
            ])
            ->assertRedirect(route('regions.create'))
            ->assertSessionHasErrors('code');
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
