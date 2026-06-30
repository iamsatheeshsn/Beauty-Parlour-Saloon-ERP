<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code', 20);
            $table->string('name');
            $table->string('phone', 30);
            $table->string('email')->nullable();
            $table->string('gender', 20)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('address')->nullable();
            $table->foreignId('emirate_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            $table->string('photo')->nullable();
            $table->text('summary')->nullable();
            $table->unsignedInteger('total_visits')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0);
            $table->timestamp('last_visit_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['company_id', 'code']);
            $table->unique(['company_id', 'phone']);
            $table->index(['company_id', 'is_active']);
            $table->index(['company_id', 'name']);
            $table->index(['company_id', 'last_visit_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
