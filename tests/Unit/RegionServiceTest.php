<?php

namespace Tests\Unit;

use App\Models\Region;
use App\Services\RegionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_filters_regions_by_search_and_status(): void
    {
        Region::factory()->create([
            'code' => 'NCR',
            'name' => 'National Capital Region',
            'is_active' => true,
        ]);

        Region::factory()->create([
            'code' => 'R1',
            'name' => 'Ilocos Region',
            'is_active' => false,
        ]);

        $regions = app(RegionService::class)->paginateForIndex([
            'search' => 'Capital',
            'status' => 'active',
        ]);

        $this->assertSame(1, $regions->total());
        $this->assertSame('NCR', $regions->items()[0]->code);
    }

    public function test_it_orders_regions_for_display(): void
    {
        Region::factory()->create(['code' => 'BARMM', 'name' => 'Bangsamoro Autonomous Region in Muslim Mindanao']);
        Region::factory()->create(['code' => 'NCR', 'name' => 'National Capital Region']);
        Region::factory()->create(['code' => 'R1', 'name' => 'Ilocos Region']);
        Region::factory()->create(['code' => 'CAR', 'name' => 'Cordillera Administrative Region']);
        Region::factory()->create(['code' => 'NIR', 'name' => 'Negros Island Region']);

        $regions = app(RegionService::class)->paginateForIndex([]);

        $this->assertSame(['R1', 'NCR', 'CAR', 'NIR', 'BARMM'], collect($regions->items())->pluck('code')->all());
    }

    public function test_it_creates_and_updates_regions(): void
    {
        $service = app(RegionService::class);

        $region = $service->create([
            'code' => 'CAR',
            'name' => 'Cordillera Administrative Region',
            'description' => null,
            'is_active' => true,
        ]);

        $updated = $service->update($region, [
            'code' => 'CAR',
            'name' => 'Cordillera',
            'description' => 'Updated.',
            'is_active' => false,
        ]);

        $this->assertSame('Cordillera', $updated->name);
        $this->assertFalse($updated->is_active);
    }
}
