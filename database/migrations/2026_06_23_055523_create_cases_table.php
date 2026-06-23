<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique();
            $table->string('title')->index();
            $table->text('description');
            $table->foreignId('complaint_type_id')->constrained()->restrictOnDelete();
            $table->string('channel')->index();
            $table->string('priority')->index();
            $table->string('status')->index();
            $table->foreignId('region_id')->constrained()->restrictOnDelete();
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by_agent')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedSmallInteger('escalation_level')->default(0)->index();
            $table->dateTime('due_date')->nullable()->index();
            $table->dateTime('closed_at')->nullable()->index();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'created_at']);
            $table->index(['region_id', 'status']);
            $table->index(['assigned_to', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
