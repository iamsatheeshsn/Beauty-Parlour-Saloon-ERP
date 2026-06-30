<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('trade_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('city')->default('Dubai');
            $table->string('country')->default('UAE');
            $table->string('trn_number')->nullable()->comment('Tax Registration Number');
            $table->string('logo')->nullable();
            $table->string('timezone')->default('Asia/Dubai');
            $table->string('currency', 3)->default('AED');
            $table->decimal('vat_rate', 5, 2)->default(5.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
