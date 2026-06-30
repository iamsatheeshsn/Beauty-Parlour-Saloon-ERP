<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_purchase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_purchase_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->decimal('quantity_ordered', 12, 3);
            $table->decimal('quantity_received', 12, 3)->default(0);
            $table->decimal('unit_cost', 12, 2);
            $table->decimal('vat_rate', 5, 2)->default(0);
            $table->decimal('line_subtotal', 12, 2)->default(0);
            $table->decimal('line_vat', 12, 2)->default(0);
            $table->decimal('line_total', 12, 2)->default(0);
            $table->date('expiry_date')->nullable();
            $table->string('batch_number', 50)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_purchase_items');
    }
};
