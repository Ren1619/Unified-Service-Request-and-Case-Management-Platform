<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunicationPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_authenticated_users_can_view_message_pages(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('messages.send'))
            ->assertOk()
            ->assertSee('Send Message');

        $this->actingAs($user)
            ->get(route('messages.inbox'))
            ->assertOk()
            ->assertSee('Inbox');

        $this->actingAs($user)
            ->get(route('messages.sent'))
            ->assertOk()
            ->assertSee('Sent Messages');

        $this->actingAs($user)
            ->get(route('messages.outbox'))
            ->assertOk()
            ->assertSee('Outbox');
    }

    public function test_authenticated_users_can_view_call_logs_page(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('call-logs.index'))
            ->assertOk()
            ->assertSee('Call Logs');
    }
}
