<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->foreignId('branch_id')->nullable()->after('company_id')->constrained()->nullOnDelete();
            $table->foreignId('department_id')->nullable()->after('branch_id')->constrained()->nullOnDelete();
            $table->foreignId('staff_designation_id')->nullable()->after('department_id')->constrained()->nullOnDelete();
            $table->string('employee_code', 30)->nullable()->after('staff_designation_id');

            $table->unique(['company_id', 'employee_code']);
            $table->index(['company_id', 'branch_id', 'is_active']);
            $table->index(['department_id', 'staff_designation_id']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropForeign(['branch_id']);
            $table->dropForeign(['department_id']);
            $table->dropForeign(['staff_designation_id']);
            $table->dropUnique(['company_id', 'employee_code']);
            $table->dropColumn([
                'company_id',
                'branch_id',
                'department_id',
                'staff_designation_id',
                'employee_code',
            ]);
        });
    }
};
