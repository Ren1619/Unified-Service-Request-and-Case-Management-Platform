<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Contact;
use App\Models\ContactGroup;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactGroupManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_guests_are_redirected_from_groups(): void
    {
        $this->get(route('groups.index'))
            ->assertRedirect(route('login'));
    }

    public function test_citizens_cannot_manage_groups(): void
    {
        $this->actingAs($this->userWithRole(UserRole::Citizen))
            ->get(route('groups.index'))
            ->assertForbidden();
    }

    public function test_internal_users_can_create_update_and_archive_groups(): void
    {
        $user = $this->userWithRole(UserRole::Supervisor);
        $contact = Contact::factory()->create();

        $this->actingAs($user)
            ->post(route('groups.store'), [
                'name' => 'Regional Operators',
                'description' => 'Operators by region.',
                'is_active' => true,
                'contact_ids' => [$contact->id],
            ])
            ->assertRedirect();

        $group = ContactGroup::query()->where('name', 'Regional Operators')->firstOrFail();

        $this->assertModelExists($group);
        $this->assertTrue($group->contacts()->whereKey($contact->id)->exists());

        $this->actingAs($user)
            ->put(route('groups.update', $group), [
                'name' => 'Updated Operators',
                'description' => 'Updated description.',
                'is_active' => false,
                'contact_ids' => [],
            ])
            ->assertRedirect(route('groups.show', $group));

        $this->assertFalse($group->refresh()->is_active);
        $this->assertSame('Updated Operators', $group->name);
        $this->assertFalse($group->contacts()->whereKey($contact->id)->exists());

        $this->actingAs($user)
            ->delete(route('groups.destroy', $group))
            ->assertRedirect(route('groups.index'));

        $this->assertSoftDeleted($group);
    }

    public function test_group_names_must_be_unique(): void
    {
        ContactGroup::factory()->create(['name' => 'Operators']);

        $this->actingAs($this->userWithRole(UserRole::CaseOfficer))
            ->from(route('groups.create'))
            ->post(route('groups.store'), [
                'name' => 'Operators',
                'description' => null,
                'is_active' => true,
            ])
            ->assertRedirect(route('groups.create'))
            ->assertSessionHasErrors('name');
    }

    public function test_internal_users_can_view_group_cluster(): void
    {
        $group = ContactGroup::factory()->create(['name' => 'Hotline Team']);
        $contact = Contact::factory()->create(['name' => 'Operator One']);
        $group->contacts()->attach($contact);

        $this->actingAs($this->userWithRole(UserRole::CustomerServiceAgent))
            ->get(route('groups.cluster'))
            ->assertOk()
            ->assertSee('groups\\/cluster', false);
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
