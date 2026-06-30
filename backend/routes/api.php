<?php

use App\Http\Controllers\Api\V1\ActivityLogController;
use App\Http\Controllers\Api\V1\AppSettingsController;
use App\Http\Controllers\Api\V1\AppointmentController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BranchController;
use App\Http\Controllers\Api\V1\CityController;
use App\Http\Controllers\Api\V1\CompanyController;
use App\Http\Controllers\Api\V1\CountryController;
use App\Http\Controllers\Api\V1\CustomerPackageController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\CustomerNoteController;
use App\Http\Controllers\Api\V1\CustomerVisitController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DepartmentController;
use App\Http\Controllers\Api\V1\ExpenseController;
use App\Http\Controllers\Api\V1\EnumController;
use App\Http\Controllers\Api\V1\BlogPostController;
use App\Http\Controllers\Api\V1\FaqController;
use App\Http\Controllers\Api\V1\GalleryItemController;
use App\Http\Controllers\Api\V1\HomepageSlideController;
use App\Http\Controllers\Api\V1\WebsiteInquiryController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\ExpenseCategoryController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\PaymentMethodController;
use App\Http\Controllers\Api\V1\PayrollController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\ProductCategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\StockMovementController;
use App\Http\Controllers\Api\V1\StockPurchaseController;
use App\Http\Controllers\Api\V1\SupplierController;
use App\Http\Controllers\Api\V1\PermissionController;
use App\Http\Controllers\Api\V1\PublicWebsiteController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\EmirateController;
use App\Http\Controllers\Api\V1\SalonServiceController;
use App\Http\Controllers\Api\V1\ServiceCategoryController;
use App\Http\Controllers\Api\V1\SaleController;
use App\Http\Controllers\Api\V1\ServicePackageController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\TestimonialController;
use App\Http\Controllers\Api\V1\StaffAttendanceController;
use App\Http\Controllers\Api\V1\StaffCommissionController;
use App\Http\Controllers\Api\V1\StaffController;
use App\Http\Controllers\Api\V1\StaffDocumentController;
use App\Http\Controllers\Api\V1\StaffLeaveController;
use App\Http\Controllers\Api\V1\StaffSalaryController;
use App\Http\Controllers\Api\V1\StaffDesignationController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

$viewManage = fn (string $resource) => [
    'index' => "permission:{$resource}.view",
    'show' => "permission:{$resource}.view",
    'store' => "permission:{$resource}.manage",
    'update' => "permission:{$resource}.manage",
    'destroy' => "permission:{$resource}.manage",
];

$viewCrud = fn (string $resource) => [
    'index' => "permission:{$resource}.view",
    'show' => "permission:{$resource}.view",
    'store' => "permission:{$resource}.create",
    'update' => "permission:{$resource}.update",
    'destroy' => "permission:{$resource}.delete",
];

/**
 * Apply action-specific permission middleware to apiResource routes.
 * Passing a keyed array to ->middleware() applies every entry to all actions.
 */
$applyResourcePermissions = function (string $uri, string $controller, array $middlewareByAction, array $resourceOptions = []) {
    $registration = Route::apiResource($uri, $controller);

    if (isset($resourceOptions['only'])) {
        $registration->only($resourceOptions['only']);
    }

    if (isset($resourceOptions['except'])) {
        $registration->except($resourceOptions['except']);
    }

    $grouped = [];
    foreach ($middlewareByAction as $action => $middleware) {
        $grouped[$middleware][] = $action;
    }

    foreach ($grouped as $middleware => $actions) {
        $registration->middlewareFor($actions, $middleware);
    }
};

$registerViewManage = fn (string $name, string $controller, array $options = []) => $applyResourcePermissions(
    $name,
    $controller,
    $viewManage($name),
    $options
);

$registerViewCrud = fn (string $name, string $controller, array $options = []) => $applyResourcePermissions(
    $name,
    $controller,
    $viewCrud($name),
    $options
);

Route::prefix('v1')->group(function () use ($applyResourcePermissions, $registerViewManage, $registerViewCrud): void {
    Route::prefix('public')->group(function (): void {
        Route::get('settings', [PublicWebsiteController::class, 'settings']);
        Route::get('services', [PublicWebsiteController::class, 'services']);
        Route::get('service-categories', [PublicWebsiteController::class, 'serviceCategories']);
        Route::get('service-packages', [PublicWebsiteController::class, 'servicePackages']);
        Route::get('products', [PublicWebsiteController::class, 'products']);
        Route::get('team', [PublicWebsiteController::class, 'team']);
        Route::get('team/featured', [PublicWebsiteController::class, 'featuredTeam']);
        Route::get('blog-posts', [PublicWebsiteController::class, 'blogPosts']);
        Route::get('blog-posts/{slug}', [PublicWebsiteController::class, 'blogPost']);
        Route::get('homepage-slides', [PublicWebsiteController::class, 'homepageSlides']);
        Route::get('testimonials', [PublicWebsiteController::class, 'testimonials']);
        Route::get('gallery', [PublicWebsiteController::class, 'gallery']);
        Route::get('faqs', [PublicWebsiteController::class, 'faqs']);
        Route::post('bookings', [PublicWebsiteController::class, 'book'])
            ->middleware('throttle:10,1');
        Route::post('inquiries', [PublicWebsiteController::class, 'inquiry'])
            ->middleware('throttle:10,1');
    });

    Route::prefix('auth')->group(function (): void {
        Route::post('login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () use ($applyResourcePermissions, $registerViewManage, $registerViewCrud): void {
        Route::get('dashboard', [DashboardController::class, 'index'])
            ->middleware('permission:dashboard.view');

        Route::get('notifications', [NotificationController::class, 'index']);

        Route::get('app-settings', [AppSettingsController::class, 'index']);

        Route::get('company', [CompanyController::class, 'show'])
            ->middleware('permission:company.view');
        Route::put('company', [CompanyController::class, 'update'])
            ->middleware('permission:company.manage');

        Route::get('enums/payment-method-types', [EnumController::class, 'paymentMethodTypes']);
        Route::get('enums/setting-types', [EnumController::class, 'settingTypes']);

        Route::get('permissions', [PermissionController::class, 'index'])
            ->middleware('permission:roles.view');

        $applyResourcePermissions('roles', RoleController::class, [
            'index' => 'permission:roles.view',
            'show' => 'permission:roles.view',
            'store' => 'permission:roles.manage',
            'update' => 'permission:roles.manage',
            'destroy' => 'permission:roles.manage',
        ]);

        $registerViewCrud('users', UserController::class);

        Route::get('activity-logs', [ActivityLogController::class, 'index'])
            ->middleware('permission:activity-logs.view');

        $registerViewManage('countries', CountryController::class);
        $registerViewManage('emirates', EmirateController::class);
        $registerViewManage('cities', CityController::class);
        $registerViewCrud('branches', BranchController::class);
        $registerViewManage('departments', DepartmentController::class);
        $registerViewManage('staff-designations', StaffDesignationController::class);
        $registerViewManage('expense-categories', ExpenseCategoryController::class);
        $registerViewManage('payment-methods', PaymentMethodController::class);
        $registerViewManage('service-categories', ServiceCategoryController::class);

        Route::get('services/stats', [SalonServiceController::class, 'stats'])
            ->middleware('permission:services.view');
        Route::post('services/{id}/image', [SalonServiceController::class, 'uploadImage'])
            ->middleware('permission:services.update');
        Route::delete('services/{id}/image', [SalonServiceController::class, 'deleteImage'])
            ->middleware('permission:services.update');
        $registerViewCrud('services', SalonServiceController::class);

        Route::post('settings/app-logo', [SettingController::class, 'uploadLogo'])
            ->middleware('permission:settings.manage');
        Route::delete('settings/app-logo', [SettingController::class, 'deleteLogo'])
            ->middleware('permission:settings.manage');
        Route::post('settings/app-favicon', [SettingController::class, 'uploadFavicon'])
            ->middleware('permission:settings.manage');
        Route::delete('settings/app-favicon', [SettingController::class, 'deleteFavicon'])
            ->middleware('permission:settings.manage');
        Route::post('settings/salon-interior-image', [SettingController::class, 'uploadSalonInteriorImage'])
            ->middleware('permission:settings.manage');
        Route::delete('settings/salon-interior-image', [SettingController::class, 'deleteSalonInteriorImage'])
            ->middleware('permission:settings.manage');
        Route::post('settings/page-banner/{key}', [SettingController::class, 'uploadPageBanner'])
            ->middleware('permission:settings.manage');
        Route::delete('settings/page-banner/{key}', [SettingController::class, 'deletePageBanner'])
            ->middleware('permission:settings.manage');
        $applyResourcePermissions('settings', SettingController::class, [
            'index' => 'permission:settings.view',
            'show' => 'permission:settings.view',
            'store' => 'permission:settings.manage',
            'update' => 'permission:settings.manage',
            'destroy' => 'permission:settings.manage',
        ]);

        Route::get('website-inquiries/stats', [WebsiteInquiryController::class, 'stats'])
            ->middleware('permission:website-inquiries.view');
        Route::patch('website-inquiries/{id}/status', [WebsiteInquiryController::class, 'updateStatus'])
            ->middleware('permission:website-inquiries.manage');
        $applyResourcePermissions('website-inquiries', WebsiteInquiryController::class, [
            'index' => 'permission:website-inquiries.view',
            'show' => 'permission:website-inquiries.view',
            'destroy' => 'permission:website-inquiries.manage',
        ], ['only' => ['index', 'show', 'destroy']]);

        Route::post('homepage-slides/{id}/image', [HomepageSlideController::class, 'uploadImage'])
            ->middleware('permission:homepage-slides.manage');
        Route::delete('homepage-slides/{id}/image', [HomepageSlideController::class, 'deleteImage'])
            ->middleware('permission:homepage-slides.manage');
        $applyResourcePermissions('homepage-slides', HomepageSlideController::class, [
            'index' => 'permission:homepage-slides.view',
            'show' => 'permission:homepage-slides.view',
            'store' => 'permission:homepage-slides.manage',
            'update' => 'permission:homepage-slides.manage',
            'destroy' => 'permission:homepage-slides.manage',
        ]);

        $applyResourcePermissions('testimonials', TestimonialController::class, [
            'index' => 'permission:testimonials.view',
            'show' => 'permission:testimonials.view',
            'store' => 'permission:testimonials.manage',
            'update' => 'permission:testimonials.manage',
            'destroy' => 'permission:testimonials.manage',
        ]);

        Route::post('gallery-items/{id}/image', [GalleryItemController::class, 'uploadImage'])
            ->middleware('permission:gallery-items.manage');
        Route::delete('gallery-items/{id}/image', [GalleryItemController::class, 'deleteImage'])
            ->middleware('permission:gallery-items.manage');
        $applyResourcePermissions('gallery-items', GalleryItemController::class, [
            'index' => 'permission:gallery-items.view',
            'show' => 'permission:gallery-items.view',
            'store' => 'permission:gallery-items.manage',
            'update' => 'permission:gallery-items.manage',
            'destroy' => 'permission:gallery-items.manage',
        ]);

        $applyResourcePermissions('faqs', FaqController::class, [
            'index' => 'permission:faqs.view',
            'show' => 'permission:faqs.view',
            'store' => 'permission:faqs.manage',
            'update' => 'permission:faqs.manage',
            'destroy' => 'permission:faqs.manage',
        ]);

        Route::post('blog-posts/{id}/featured-image', [BlogPostController::class, 'uploadFeaturedImage'])
            ->middleware('permission:blog-posts.manage');
        Route::delete('blog-posts/{id}/featured-image', [BlogPostController::class, 'deleteFeaturedImage'])
            ->middleware('permission:blog-posts.manage');
        $applyResourcePermissions('blog-posts', BlogPostController::class, [
            'index' => 'permission:blog-posts.view',
            'show' => 'permission:blog-posts.view',
            'store' => 'permission:blog-posts.manage',
            'update' => 'permission:blog-posts.manage',
            'destroy' => 'permission:blog-posts.manage',
        ]);

        Route::get('customers/search-by-phone', [CustomerController::class, 'searchByPhone'])
            ->middleware('permission:customers.view');
        Route::get('customers/{id}/history', [CustomerController::class, 'history'])
            ->middleware('permission:customers.view');
        Route::post('customers/{id}/photo', [CustomerController::class, 'uploadPhoto'])
            ->middleware('permission:customers.update');
        Route::delete('customers/{id}/photo', [CustomerController::class, 'deletePhoto'])
            ->middleware('permission:customers.update');
        $registerViewCrud('customers', CustomerController::class);

        Route::get('customers/{customerId}/notes', [CustomerNoteController::class, 'index'])
            ->middleware('permission:customer-notes.view');
        Route::post('customers/{customerId}/notes', [CustomerNoteController::class, 'store'])
            ->middleware('permission:customer-notes.create');
        Route::put('customer-notes/{id}', [CustomerNoteController::class, 'update'])
            ->middleware('permission:customer-notes.update');
        Route::delete('customer-notes/{id}', [CustomerNoteController::class, 'destroy'])
            ->middleware('permission:customer-notes.delete');

        Route::get('customers/{customerId}/visits', [CustomerVisitController::class, 'index'])
            ->middleware('permission:customer-visits.view');
        Route::post('customers/{customerId}/visits', [CustomerVisitController::class, 'store'])
            ->middleware('permission:customer-visits.create');
        Route::put('customer-visits/{id}', [CustomerVisitController::class, 'update'])
            ->middleware('permission:customer-visits.update');
        Route::delete('customer-visits/{id}', [CustomerVisitController::class, 'destroy'])
            ->middleware('permission:customer-visits.delete');

        Route::get('staff/dashboard', [StaffController::class, 'dashboard'])
            ->middleware('permission:staff.view');
        Route::get('staff/{id}/dashboard', [StaffController::class, 'memberDashboard'])
            ->middleware('permission:staff.view');
        Route::post('staff/{id}/avatar', [StaffController::class, 'uploadAvatar'])
            ->middleware('permission:staff.update');
        Route::delete('staff/{id}/avatar', [StaffController::class, 'deleteAvatar'])
            ->middleware('permission:staff.update');
        $registerViewCrud('staff', StaffController::class);

        Route::get('staff/{userId}/documents', [StaffDocumentController::class, 'index'])
            ->middleware('permission:staff-documents.view');
        Route::post('staff/{userId}/documents', [StaffDocumentController::class, 'store'])
            ->middleware('permission:staff-documents.create');
        Route::put('staff-documents/{id}', [StaffDocumentController::class, 'update'])
            ->middleware('permission:staff-documents.update');
        Route::delete('staff-documents/{id}', [StaffDocumentController::class, 'destroy'])
            ->middleware('permission:staff-documents.delete');

        Route::get('staff/{userId}/salaries/current', [StaffSalaryController::class, 'current'])
            ->middleware('permission:staff-salary.view');
        Route::get('staff/{userId}/salaries', [StaffSalaryController::class, 'index'])
            ->middleware('permission:staff-salary.view');
        Route::post('staff/{userId}/salaries', [StaffSalaryController::class, 'store'])
            ->middleware('permission:staff-salary.create');
        Route::put('staff-salaries/{id}', [StaffSalaryController::class, 'update'])
            ->middleware('permission:staff-salary.update');
        Route::delete('staff-salaries/{id}', [StaffSalaryController::class, 'destroy'])
            ->middleware('permission:staff-salary.delete');

        Route::get('staff/{userId}/attendance', [StaffAttendanceController::class, 'index'])
            ->middleware('permission:staff-attendance.view');
        Route::post('staff/{userId}/attendance', [StaffAttendanceController::class, 'store'])
            ->middleware('permission:staff-attendance.create');
        Route::put('staff-attendance/{id}', [StaffAttendanceController::class, 'update'])
            ->middleware('permission:staff-attendance.update');
        Route::delete('staff-attendance/{id}', [StaffAttendanceController::class, 'destroy'])
            ->middleware('permission:staff-attendance.delete');

        Route::get('staff/{userId}/leave', [StaffLeaveController::class, 'index'])
            ->middleware('permission:staff-leave.view');
        Route::post('staff/{userId}/leave', [StaffLeaveController::class, 'store'])
            ->middleware('permission:staff-leave.create');
        Route::put('staff-leave/{id}', [StaffLeaveController::class, 'update'])
            ->middleware('permission:staff-leave.update');
        Route::delete('staff-leave/{id}', [StaffLeaveController::class, 'destroy'])
            ->middleware('permission:staff-leave.delete');

        Route::get('staff/{userId}/commission', [StaffCommissionController::class, 'index'])
            ->middleware('permission:staff-commission.view');
        Route::post('staff/{userId}/commission', [StaffCommissionController::class, 'store'])
            ->middleware('permission:staff-commission.create');
        Route::put('staff-commission/{id}', [StaffCommissionController::class, 'update'])
            ->middleware('permission:staff-commission.update');
        Route::delete('staff-commission/{id}', [StaffCommissionController::class, 'destroy'])
            ->middleware('permission:staff-commission.delete');

        Route::get('appointments/calendar', [AppointmentController::class, 'calendar'])
            ->middleware('permission:appointments.view');
        Route::post('appointments/walk-in', [AppointmentController::class, 'walkIn'])
            ->middleware('permission:appointments.create');
        Route::patch('appointments/{id}/status', [AppointmentController::class, 'updateStatus'])
            ->middleware('permission:appointments.update');
        Route::patch('appointments/{id}/assign-staff', [AppointmentController::class, 'assignStaff'])
            ->middleware('permission:appointments.update');
        Route::get('appointments', [AppointmentController::class, 'index'])
            ->middleware('permission:appointments.view');
        Route::post('appointments', [AppointmentController::class, 'store'])
            ->middleware('permission:appointments.create');
        Route::get('appointments/{id}', [AppointmentController::class, 'show'])
            ->middleware('permission:appointments.view');
        Route::put('appointments/{id}', [AppointmentController::class, 'update'])
            ->middleware('permission:appointments.update');
        Route::delete('appointments/{id}', [AppointmentController::class, 'destroy'])
            ->middleware('permission:appointments.delete');

        Route::get('service-packages/stats', [ServicePackageController::class, 'stats'])
            ->middleware('permission:service-packages.view');
        Route::get('service-packages/active', [ServicePackageController::class, 'active'])
            ->middleware('permission:service-packages.view');
        Route::get('service-packages', [ServicePackageController::class, 'index'])
            ->middleware('permission:service-packages.view');
        Route::post('service-packages', [ServicePackageController::class, 'store'])
            ->middleware('permission:service-packages.create');
        Route::get('service-packages/{id}', [ServicePackageController::class, 'show'])
            ->middleware('permission:service-packages.view');
        Route::put('service-packages/{id}', [ServicePackageController::class, 'update'])
            ->middleware('permission:service-packages.update');
        Route::delete('service-packages/{id}', [ServicePackageController::class, 'destroy'])
            ->middleware('permission:service-packages.delete');

        Route::get('customer-packages/transactions', [CustomerPackageController::class, 'transactions'])
            ->middleware('permission:customer-packages.view');
        Route::post('customer-packages/purchase', [CustomerPackageController::class, 'purchase'])
            ->middleware('permission:customer-packages.purchase');
        Route::post('customer-packages/consume', [CustomerPackageController::class, 'consume'])
            ->middleware('permission:customer-packages.consume');
        Route::post('customer-packages/allocate', [CustomerPackageController::class, 'allocate'])
            ->middleware('permission:customer-packages.allocate');
        Route::get('customer-packages', [CustomerPackageController::class, 'index'])
            ->middleware('permission:customer-packages.view');
        Route::get('customer-packages/{id}', [CustomerPackageController::class, 'show'])
            ->middleware('permission:customer-packages.view');
        Route::get('customers/{customerId}/packages', [CustomerPackageController::class, 'forCustomer'])
            ->middleware('permission:customer-packages.view');
        Route::get('customers/{customerId}/point-balance', [CustomerPackageController::class, 'balance'])
            ->middleware('permission:customer-packages.view');

        Route::get('sales/stats', [SaleController::class, 'stats'])
            ->middleware('permission:sales.view');
        Route::post('sales/preview', [SaleController::class, 'preview'])
            ->middleware('permission:sales.create');
        Route::post('sales/checkout', [SaleController::class, 'checkout'])
            ->middleware('permission:sales.create');
        Route::get('sales', [SaleController::class, 'index'])
            ->middleware('permission:sales.view');
        Route::get('sales/{id}', [SaleController::class, 'show'])
            ->middleware('permission:sales.view');
        Route::get('sales/{id}/receipt', [SaleController::class, 'receipt'])
            ->middleware('permission:sales.view');

        $registerViewManage('product-categories', ProductCategoryController::class);
        $registerViewManage('brands', BrandController::class);
        $registerViewManage('suppliers', SupplierController::class);

        Route::get('products/stats', [ProductController::class, 'stats'])
            ->middleware('permission:products.view');
        Route::post('products/{id}/image', [ProductController::class, 'uploadImage'])
            ->middleware('permission:products.update');
        Route::delete('products/{id}/image', [ProductController::class, 'deleteImage'])
            ->middleware('permission:products.update');
        $registerViewCrud('products', ProductController::class);

        Route::get('inventory/stats', [InventoryController::class, 'stats'])
            ->middleware('permission:inventory.view');
        Route::get('inventory/low-stock', [InventoryController::class, 'lowStock'])
            ->middleware('permission:inventory.view');
        Route::get('inventory/stock-levels', [InventoryController::class, 'stockLevels'])
            ->middleware('permission:inventory.view');

        Route::get('stock-purchases', [StockPurchaseController::class, 'index'])
            ->middleware('permission:stock-purchases.view');
        Route::post('stock-purchases', [StockPurchaseController::class, 'store'])
            ->middleware('permission:stock-purchases.create');
        Route::get('stock-purchases/{id}', [StockPurchaseController::class, 'show'])
            ->middleware('permission:stock-purchases.view');
        Route::post('stock-purchases/{id}/receive', [StockPurchaseController::class, 'receive'])
            ->middleware('permission:stock-purchases.update');

        Route::get('stock-movements', [StockMovementController::class, 'index'])
            ->middleware('permission:stock-movements.view');
        Route::post('stock-movements/consume', [StockMovementController::class, 'consume'])
            ->middleware('permission:stock-movements.consume');
        Route::post('stock-movements/adjust', [StockMovementController::class, 'adjust'])
            ->middleware('permission:stock-movements.adjust');

        Route::get('expenses/stats', [ExpenseController::class, 'stats'])
            ->middleware('permission:expenses.view');
        Route::get('expenses/report', [ExpenseController::class, 'report'])
            ->middleware('permission:expenses.reports');
        Route::post('expenses/{id}/receipt', [ExpenseController::class, 'uploadReceipt'])
            ->middleware('permission:expenses.update');
        Route::delete('expenses/{id}/receipt', [ExpenseController::class, 'deleteReceipt'])
            ->middleware('permission:expenses.update');
        Route::get('expenses', [ExpenseController::class, 'index'])
            ->middleware('permission:expenses.view');
        Route::post('expenses', [ExpenseController::class, 'store'])
            ->middleware('permission:expenses.create');
        Route::get('expenses/{id}', [ExpenseController::class, 'show'])
            ->middleware('permission:expenses.view');
        Route::put('expenses/{id}', [ExpenseController::class, 'update'])
            ->middleware('permission:expenses.update');
        Route::delete('expenses/{id}', [ExpenseController::class, 'destroy'])
            ->middleware('permission:expenses.delete');

        Route::get('payroll/stats', [PayrollController::class, 'stats'])
            ->middleware('permission:payroll.view');
        Route::get('payroll/staff-overview', [PayrollController::class, 'staffOverview'])
            ->middleware('permission:payroll.view');
        Route::get('payroll/pending-leave', [PayrollController::class, 'pendingLeave'])
            ->middleware('permission:payroll.view');
        Route::post('payroll/preview', [PayrollController::class, 'preview'])
            ->middleware('permission:payslips.generate');
        Route::post('payroll/generate', [PayrollController::class, 'generate'])
            ->middleware('permission:payslips.generate');
        Route::get('payroll/payslips', [PayrollController::class, 'index'])
            ->middleware('permission:payslips.view');
        Route::get('payroll/payslips/{id}', [PayrollController::class, 'show'])
            ->middleware('permission:payslips.view');
        Route::patch('payroll/payslips/{id}/approve', [PayrollController::class, 'approve'])
            ->middleware('permission:payslips.update');
        Route::patch('payroll/payslips/{id}/mark-paid', [PayrollController::class, 'markPaid'])
            ->middleware('permission:payslips.update');
        Route::delete('payroll/payslips/{id}', [PayrollController::class, 'destroy'])
            ->middleware('permission:payslips.delete');

        Route::get('reports/summary', [ReportController::class, 'summary'])
            ->middleware('permission:reports.view');
        Route::get('reports/sales', [ReportController::class, 'sales'])
            ->middleware('permission:reports.view');
        Route::get('reports/customers', [ReportController::class, 'customers'])
            ->middleware('permission:reports.view');
        Route::get('reports/staff', [ReportController::class, 'staff'])
            ->middleware('permission:reports.view');
        Route::get('reports/inventory', [ReportController::class, 'inventory'])
            ->middleware('permission:reports.view');
        Route::get('reports/financial', [ReportController::class, 'financial'])
            ->middleware('permission:reports.view');
        Route::get('reports/vat', [ReportController::class, 'vat'])
            ->middleware('permission:reports.view');
    });
});
