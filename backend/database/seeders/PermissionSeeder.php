<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'dashboard.view',
            // Users & access
            'users.view', 'users.create', 'users.update', 'users.delete',
            'roles.view', 'roles.manage',
            // Company & branches
            'company.view', 'company.manage',
            'branches.view', 'branches.create', 'branches.update', 'branches.delete',
            // Settings
            'settings.view', 'settings.manage',
            // Geography masters
            'countries.view', 'countries.manage',
            'emirates.view', 'emirates.manage',
            'cities.view', 'cities.manage',
            // HR masters
            'departments.view', 'departments.manage',
            'staff-designations.view', 'staff-designations.manage',
            // Finance masters
            'expense-categories.view', 'expense-categories.manage',
            'payment-methods.view', 'payment-methods.manage',
            // Service masters
            'service-categories.view', 'service-categories.manage',
            'services.view', 'services.create', 'services.update', 'services.delete',
            'appointments.view', 'appointments.create', 'appointments.update', 'appointments.delete',
            'service-packages.view', 'service-packages.create', 'service-packages.update', 'service-packages.delete',
            'customer-packages.view', 'customer-packages.purchase', 'customer-packages.consume', 'customer-packages.allocate',
            'sales.view', 'sales.create',
            // Inventory
            'product-categories.view', 'product-categories.manage',
            'brands.view', 'brands.manage',
            'suppliers.view', 'suppliers.manage',
            'products.view', 'products.create', 'products.update', 'products.delete',
            'stock-purchases.view', 'stock-purchases.create', 'stock-purchases.update',
            'stock-movements.view', 'stock-movements.consume', 'stock-movements.adjust',
            'inventory.view',
            // Expenses
            'expenses.view', 'expenses.create', 'expenses.update', 'expenses.delete', 'expenses.reports',
            // Payroll
            'payroll.view',
            'payslips.view', 'payslips.generate', 'payslips.update', 'payslips.delete',
            // Reports
            'reports.view',
            // Customers & CRM
            'customers.view', 'customers.create', 'customers.update', 'customers.delete',
            'customer-notes.view', 'customer-notes.create', 'customer-notes.update', 'customer-notes.delete',
            'customer-visits.view', 'customer-visits.create', 'customer-visits.update', 'customer-visits.delete',
            // Staff & HR
            'staff.view', 'staff.create', 'staff.update', 'staff.delete',
            'staff-documents.view', 'staff-documents.create', 'staff-documents.update', 'staff-documents.delete',
            'staff-salary.view', 'staff-salary.create', 'staff-salary.update', 'staff-salary.delete',
            'staff-attendance.view', 'staff-attendance.create', 'staff-attendance.update', 'staff-attendance.delete',
            'staff-leave.view', 'staff-leave.create', 'staff-leave.update', 'staff-leave.delete',
            'staff-commission.view', 'staff-commission.create', 'staff-commission.update', 'staff-commission.delete',
            // Website
            'website-inquiries.view', 'website-inquiries.manage',
            'homepage-slides.view', 'homepage-slides.manage',
            'testimonials.view', 'testimonials.manage',
            'gallery-items.view', 'gallery-items.manage',
            'faqs.view', 'faqs.manage',
            'blog-posts.view', 'blog-posts.manage',
            // Logs
            'activity-logs.view',
        ];

        foreach ($permissions as $permission) {
            Permission::query()->firstOrCreate(
                ['name' => $permission, 'guard_name' => 'web'],
                ['name' => $permission, 'guard_name' => 'web']
            );
        }

        $all = $permissions;

        $rolePermissions = [
            'owner' => $all,
            'admin' => array_filter($all, fn ($p) => ! str_starts_with($p, 'roles.')),
            'receptionist' => [
                'dashboard.view',
                'users.view',
                'branches.view',
                'departments.view',
                'staff-designations.view',
                'payment-methods.view',
                'service-categories.view',
                'services.view',
                'appointments.view', 'appointments.create', 'appointments.update',
                'service-packages.view',
                'customer-packages.view', 'customer-packages.purchase', 'customer-packages.consume',
                'sales.view', 'sales.create',
                'product-categories.view',
                'brands.view',
                'suppliers.view',
                'products.view',
                'stock-purchases.view', 'stock-purchases.create',
                'stock-movements.view', 'stock-movements.consume',
                'inventory.view',
                'expense-categories.view',
                'expenses.view', 'expenses.create',
                'payroll.view', 'payslips.view',
                'reports.view',
                'customers.view', 'customers.create', 'customers.update',
                'customer-notes.view', 'customer-notes.create', 'customer-notes.update',
                'customer-visits.view', 'customer-visits.create', 'customer-visits.update',
                'staff.view', 'staff-attendance.view', 'staff-leave.view', 'staff-leave.create',
                'website-inquiries.view', 'website-inquiries.manage',
                'homepage-slides.view',
                'testimonials.view',
                'gallery-items.view',
                'faqs.view',
                'blog-posts.view',
            ],
            'staff' => [
                'dashboard.view',
                'service-categories.view',
                'services.view',
                'appointments.view',
                'staff.view',
                'staff-attendance.view',
                'staff-leave.view', 'staff-leave.create',
                'staff-salary.view',
                'staff-commission.view',
                'staff-documents.view',
            ],
        ];

        foreach ($rolePermissions as $roleName => $perms) {
            $role = Role::query()->where('name', $roleName)->first();
            if ($role) {
                $role->syncPermissions($perms);
            }
        }
    }
}
