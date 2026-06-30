<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique(['key']);

            $table->foreignId('company_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->after('company_id')->constrained()->nullOnDelete();

            $table->unique(['company_id', 'branch_id', 'key'], 'settings_company_branch_key_unique');
            $table->index(['company_id', 'group']);
            $table->index(['branch_id', 'group']);
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropForeign(['branch_id']);
            $table->dropUnique('settings_company_branch_key_unique');

            $table->dropColumn(['company_id', 'branch_id']);

            $table->unique('key');
        });
    }
};
