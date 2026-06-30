<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('salon_service_id')->nullable()->constrained('services')->nullOnDelete();
            $table->foreignId('staff_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('service_name');
            $table->unsignedSmallInteger('duration_minutes')->default(30);
            $table->decimal('price', 12, 2)->default(0);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['appointment_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment_items');
    }
};
