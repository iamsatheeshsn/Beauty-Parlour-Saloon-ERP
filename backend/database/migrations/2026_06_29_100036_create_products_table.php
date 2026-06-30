<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('default_supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->string('code', 30);
            $table->string('barcode', 50)->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('unit', 20)->default('pcs');
            $table->decimal('cost_price', 12, 2)->default(0);
            $table->decimal('retail_price', 12, 2)->default(0);
            $table->decimal('vat_rate', 5, 2)->default(5);
            $table->boolean('vat_inclusive')->default(false);
            $table->boolean('track_inventory')->default(true);
            $table->boolean('is_sellable')->default(false);
            $table->boolean('is_consumable')->default(true);
            $table->decimal('reorder_level', 12, 3)->default(0);
            $table->decimal('reorder_quantity', 12, 3)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['company_id', 'code']);
            $table->index(['company_id', 'product_category_id', 'is_active']);
            $table->index(['company_id', 'barcode']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
