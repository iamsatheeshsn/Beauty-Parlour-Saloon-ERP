<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('code', 20)->nullable()->after('id');
            $table->foreignId('country_id')->nullable()->after('address')->constrained()->nullOnDelete();
            $table->foreignId('emirate_id')->nullable()->after('country_id')->constrained()->nullOnDelete();
            $table->foreignId('city_id')->nullable()->after('emirate_id')->constrained()->nullOnDelete();
            $table->string('postal_code', 20)->nullable()->after('address');
            $table->string('website')->nullable()->after('email');

            $table->unique('code');
            $table->index(['country_id', 'emirate_id', 'city_id']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropForeign(['country_id']);
            $table->dropForeign(['emirate_id']);
            $table->dropForeign(['city_id']);
            $table->dropUnique(['code']);
            $table->dropIndex(['country_id', 'emirate_id', 'city_id']);
            $table->dropColumn(['code', 'country_id', 'emirate_id', 'city_id', 'postal_code', 'website']);
        });
    }
};
