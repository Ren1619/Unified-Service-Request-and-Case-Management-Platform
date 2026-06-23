<?php

namespace Database\Seeders;

use App\Models\ComplaintType;
use Illuminate\Database\Seeder;

class ComplaintTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $complaintTypes = [
            'Technical Issue',
            'Service Complaint',
            'Billing Concern',
            'Request for Assistance',
            'Request for Information',
            'Others',
        ];

        foreach ($complaintTypes as $name) {
            ComplaintType::query()->updateOrCreate(
                ['name' => $name],
                [
                    'description' => "{$name} cases and service requests.",
                    'is_active' => true,
                ],
            );
        }
    }
}
