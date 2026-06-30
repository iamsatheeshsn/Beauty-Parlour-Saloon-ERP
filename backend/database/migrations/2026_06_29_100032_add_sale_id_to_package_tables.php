<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_packages', function (Blueprint $table) {
            $table->foreignId('sale_id')->nullable()->after('sold_by')->constrained()->nullOnDelete();
        });

        Schema::table('customer_point_transactions', function (Blueprint $table) {
            $table->foreignId('sale_id')->nullable()->after('appointment_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('customer_point_transactions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('sale_id');
        });

        Schema::table('customer_packages', function (Blueprint $table) {
            $table->dropConstrainedForeignId('sale_id');
        });
    }
};
