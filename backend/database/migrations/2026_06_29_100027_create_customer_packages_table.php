<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_package_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sold_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('code', 20);
            $table->decimal('purchase_amount', 12, 2);
            $table->unsignedInteger('points_allocated');
            $table->unsignedInteger('points_remaining');
            $table->unsignedInteger('points_consumed')->default(0);
            $table->string('status', 20)->default('active');
            $table->timestamp('purchased_at');
            $table->timestamp('expires_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['company_id', 'code']);
            $table->index(['company_id', 'customer_id', 'status']);
            $table->index(['customer_id', 'purchased_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_packages');
    }
};
