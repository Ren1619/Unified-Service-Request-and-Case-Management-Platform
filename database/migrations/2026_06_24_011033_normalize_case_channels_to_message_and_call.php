<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('cases')
            ->whereIn('channel', ['self_service', 'agent_assisted'])
            ->update(['channel' => 'message']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
