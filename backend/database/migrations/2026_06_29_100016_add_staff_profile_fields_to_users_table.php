<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->string('gender', 20)->nullable()->after('date_of_birth');
            $table->string('nationality', 100)->nullable()->after('gender');
            $table->date('joining_date')->nullable()->after('nationality');
            $table->string('employment_type', 30)->nullable()->after('joining_date');
            $table->string('emirates_id', 30)->nullable()->after('employment_type');
            $table->string('visa_number', 50)->nullable()->after('emirates_id');
            $table->date('visa_expiry')->nullable()->after('visa_number');
            $table->text('address')->nullable()->after('visa_expiry');
            $table->string('emergency_contact_name')->nullable()->after('address');
            $table->string('emergency_contact_phone', 30)->nullable()->after('emergency_contact_name');
            $table->text('staff_notes')->nullable()->after('emergency_contact_phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_birth',
                'gender',
                'nationality',
                'joining_date',
                'employment_type',
                'emirates_id',
                'visa_number',
                'visa_expiry',
                'address',
                'emergency_contact_name',
                'emergency_contact_phone',
                'staff_notes',
            ]);
        });
    }
};
