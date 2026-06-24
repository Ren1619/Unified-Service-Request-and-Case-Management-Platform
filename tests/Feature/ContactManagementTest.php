<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Contact;
use App\Models\ContactGroup;
use App\Models\Region;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_guests_are_redirected_from_contacts(): void
    {
        $this->get(route('contacts.index'))
            ->assertRedirect(route('login'));
    }

    public function test_citizens_cannot_manage_contacts(): void
    {
        $this->actingAs($this->userWithRole(UserRole::Citizen))
            ->get(route('contacts.index'))
            ->assertForbidden();
    }

    public function test_internal_users_can_view_contacts(): void
    {
        $region = Region::factory()->create(['code' => 'NCR', 'name' => 'National Capital Region']);
        Contact::factory()->create([
            'name' => 'Juan Dela Cruz',
            'region_id' => $region->id,
        ]);

        $this->actingAs($this->userWithRole(UserRole::CustomerServiceAgent))
            ->get(route('contacts.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('contacts/index')
                ->where('contacts.data.0.region.code', 'NCR')
                ->has('regions', 1)
            );
    }

    public function test_contact_forms_list_regions_in_display_order(): void
    {
        Region::factory()->create(['code' => 'NCR', 'name' => 'National Capital Region']);
        Region::factory()->create(['code' => 'R2', 'name' => 'Cagayan Valley']);
        Region::factory()->create(['code' => 'R1', 'name' => 'Ilocos Region']);
        Region::factory()->create(['code' => 'CAR', 'name' => 'Cordillera Administrative Region']);

        $this->actingAs($this->userWithRole(UserRole::CustomerServiceAgent))
            ->get(route('contacts.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('contacts/create')
                ->where('regions.0.code', 'R1')
                ->where('regions.1.code', 'R2')
                ->where('regions.2.code', 'NCR')
                ->where('regions.3.code', 'CAR')
            );
    }

    public function test_internal_users_can_create_update_and_archive_contacts(): void
    {
        $user = $this->userWithRole(UserRole::CustomerServiceAgent);
        $group = ContactGroup::factory()->create(['name' => 'Operators']);
        $region = Region::factory()->create(['code' => 'NCR']);
        $updatedRegion = Region::factory()->create(['code' => 'CAR']);

        $this->actingAs($user)
            ->post(route('contacts.store'), [
                'name' => 'Maria Santos',
                'mobile_number' => '+63 917 111 2222',
                'phone_number' => '8812-0000',
                'email' => 'maria@example.com',
                'organization' => 'Regional Office',
                'position' => 'Coordinator',
                'region_id' => $region->id,
                'notes' => 'Primary SMS contact.',
                'is_active' => true,
                'group_ids' => [$group->id],
            ])
            ->assertRedirect();

        $contact = Contact::query()->where('email', 'maria@example.com')->firstOrFail();

        $this->assertModelExists($contact);
        $this->assertSame($region->id, $contact->region_id);
        $this->assertTrue($contact->groups()->whereKey($group->id)->exists());

        $this->actingAs($user)
            ->put(route('contacts.update', $contact), [
                'name' => 'Maria Santos Updated',
                'mobile_number' => '+63 917 111 3333',
                'phone_number' => null,
                'email' => 'maria.updated@example.com',
                'organization' => 'Central Office',
                'position' => 'Lead Coordinator',
                'region_id' => $updatedRegion->id,
                'notes' => 'Updated.',
                'is_active' => false,
                'group_ids' => [],
            ])
            ->assertRedirect(route('contacts.show', $contact));

        $this->assertFalse($contact->refresh()->is_active);
        $this->assertSame('Maria Santos Updated', $contact->name);
        $this->assertSame($updatedRegion->id, $contact->region_id);
        $this->assertFalse($contact->groups()->whereKey($group->id)->exists());

        $this->actingAs($user)
            ->delete(route('contacts.destroy', $contact))
            ->assertRedirect(route('contacts.index'));

        $this->assertSoftDeleted($contact);
    }

    public function test_contact_validation_requires_a_name(): void
    {
        $this->actingAs($this->userWithRole(UserRole::CaseOfficer))
            ->from(route('contacts.create'))
            ->post(route('contacts.store'), [
                'name' => '',
                'email' => 'not-an-email',
            ])
            ->assertRedirect(route('contacts.create'))
            ->assertSessionHasErrors(['name', 'email']);
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
