<?php

namespace Tests\Unit;

use App\Models\ComplaintType;
use App\Services\ComplaintTypeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComplaintTypeServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_filters_complaint_types_by_search_and_status(): void
    {
        ComplaintType::factory()->create([
            'name' => 'Technical Issue',
            'is_active' => true,
        ]);

        ComplaintType::factory()->create([
            'name' => 'Billing Concern',
            'is_active' => false,
        ]);

        $complaintTypes = app(ComplaintTypeService::class)->paginateForIndex([
            'search' => 'Technical',
            'status' => 'active',
        ]);

        $this->assertSame(1, $complaintTypes->total());
        $this->assertSame('Technical Issue', $complaintTypes->items()[0]->name);
    }

    public function test_it_creates_and_updates_complaint_types(): void
    {
        $service = app(ComplaintTypeService::class);

        $complaintType = $service->create([
            'name' => 'Request for Assistance',
            'description' => null,
            'is_active' => true,
        ]);

        $updated = $service->update($complaintType, [
            'name' => 'Assistance Request',
            'description' => 'Updated.',
            'is_active' => false,
        ]);

        $this->assertSame('Assistance Request', $updated->name);
        $this->assertFalse($updated->is_active);
    }
}
