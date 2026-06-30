<?php

namespace App\Repositories;

use App\Enums\SaleStatusEnum;
use App\Models\Appointment;
use App\Models\BranchProductStock;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\Payslip;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\StockMovement;
use App\Models\StockPurchase;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReportRepository
{
    protected function saleBase(int $companyId, ?string $from, ?string $to, ?int $branchId = null)
    {
        return Sale::query()
            ->where('company_id', $companyId)
            ->where('status', SaleStatusEnum::Paid->value)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($from, fn ($q) => $q->whereDate('paid_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('paid_at', '<=', $to));
    }

    /**
     * @return array<string, mixed>
     */
    public function salesSummary(int $companyId, ?string $from, ?string $to, ?int $branchId = null): array
    {
        $query = $this->saleBase($companyId, $from, $to, $branchId);
        $count = (clone $query)->count();
        $revenue = (float) (clone $query)->sum('total_amount');
        $subtotal = (float) (clone $query)->sum('subtotal');
        $discount = (float) (clone $query)->sum('discount_amount');
        $vat = (float) (clone $query)->sum('vat_amount');

        return [
            'invoice_count' => $count,
            'total_revenue' => round($revenue, 2),
            'subtotal' => round($subtotal, 2),
            'discount_amount' => round($discount, 2),
            'vat_collected' => round($vat, 2),
            'average_ticket' => $count > 0 ? round($revenue / $count, 2) : 0,
        ];
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, float>}
     */
    public function salesByDay(int $companyId, ?string $from, ?string $to, ?int $branchId = null): array
    {
        $start = Carbon::parse($from ?? now()->startOfMonth());
        $end = Carbon::parse($to ?? now());
        $labels = [];
        $data = [];

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $labels[] = $date->format('M d');
            $data[] = (float) $this->saleBase($companyId, $date->toDateString(), $date->toDateString(), $branchId)->sum('total_amount');
        }

        return ['labels' => $labels, 'data' => $data];
    }

    public function salesByPaymentMethod(int $companyId, ?string $from, ?string $to, ?int $branchId = null): Collection
    {
        return SalePayment::query()
            ->select('payment_method_id', DB::raw('SUM(sale_payments.amount) as total'), DB::raw('COUNT(*) as count'))
            ->join('sales', 'sales.id', '=', 'sale_payments.sale_id')
            ->with('paymentMethod')
            ->where('sales.company_id', $companyId)
            ->where('sales.status', SaleStatusEnum::Paid->value)
            ->when($branchId, fn ($q) => $q->where('sales.branch_id', $branchId))
            ->when($from, fn ($q) => $q->whereDate('sales.paid_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('sales.paid_at', '<=', $to))
            ->groupBy('payment_method_id')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'payment_method_id' => $row->payment_method_id,
                'name' => $row->paymentMethod?->name ?? 'Unknown',
                'total' => (float) $row->total,
                'count' => (int) $row->count,
            ]);
    }

    public function topServices(int $companyId, ?string $from, ?string $to, int $limit = 10): Collection
    {
        return SaleItem::query()
            ->select('salon_service_id', DB::raw('SUM(sale_items.quantity) as qty'), DB::raw('SUM(sale_items.line_total) as revenue'))
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->with('service')
            ->where('sales.company_id', $companyId)
            ->where('sales.status', SaleStatusEnum::Paid->value)
            ->whereNotNull('sale_items.salon_service_id')
            ->when($from, fn ($q) => $q->whereDate('sales.paid_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('sales.paid_at', '<=', $to))
            ->groupBy('salon_service_id')
            ->orderByDesc('revenue')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'service_id' => $row->salon_service_id,
                'name' => $row->service?->name ?? 'Service',
                'quantity' => (int) $row->qty,
                'revenue' => (float) $row->revenue,
            ]);
    }

    public function salesByBranch(int $companyId, ?string $from, ?string $to): Collection
    {
        return Sale::query()
            ->select('branch_id', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_amount) as revenue'))
            ->with('branch')
            ->where('company_id', $companyId)
            ->where('status', SaleStatusEnum::Paid->value)
            ->when($from, fn ($q) => $q->whereDate('paid_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('paid_at', '<=', $to))
            ->groupBy('branch_id')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($row) => [
                'branch_id' => $row->branch_id,
                'name' => $row->branch?->name ?? 'Unassigned',
                'invoice_count' => (int) $row->count,
                'revenue' => (float) $row->revenue,
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function customersSummary(int $companyId, ?string $from, ?string $to): array
    {
        $total = Customer::query()->where('company_id', $companyId)->count();
        $active = Customer::query()->where('company_id', $companyId)->where('is_active', true)->count();
        $newInPeriod = Customer::query()
            ->where('company_id', $companyId)
            ->when($from, fn ($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('created_at', '<=', $to))
            ->count();

        $returning = $this->saleBase($companyId, $from, $to)
            ->whereNotNull('customer_id')
            ->distinct('customer_id')
            ->count('customer_id');

        return [
            'total_customers' => $total,
            'active_customers' => $active,
            'new_customers' => $newInPeriod,
            'customers_with_purchases' => $returning,
        ];
    }

    public function topCustomers(int $companyId, ?string $from, ?string $to, int $limit = 10): Collection
    {
        return Sale::query()
            ->select('customer_id', DB::raw('COUNT(*) as visits'), DB::raw('SUM(total_amount) as spent'))
            ->with('customer')
            ->where('company_id', $companyId)
            ->where('status', SaleStatusEnum::Paid->value)
            ->whereNotNull('customer_id')
            ->when($from, fn ($q) => $q->whereDate('paid_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('paid_at', '<=', $to))
            ->groupBy('customer_id')
            ->orderByDesc('spent')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'customer_id' => $row->customer_id,
                'name' => $row->customer?->name ?? 'Customer',
                'phone' => $row->customer?->phone,
                'visits' => (int) $row->visits,
                'spent' => (float) $row->spent,
            ]);
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, int>}
     */
    public function newCustomersByDay(int $companyId, ?string $from, ?string $to): array
    {
        $start = Carbon::parse($from ?? now()->startOfMonth());
        $end = Carbon::parse($to ?? now());
        $labels = [];
        $data = [];

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $labels[] = $date->format('M d');
            $data[] = Customer::query()
                ->where('company_id', $companyId)
                ->whereDate('created_at', $date)
                ->count();
        }

        return ['labels' => $labels, 'data' => $data];
    }

    /**
     * @return array<string, mixed>
     */
    public function staffSummary(int $companyId, ?string $from, ?string $to): array
    {
        $activeStaff = User::query()->where('company_id', $companyId)->where('is_active', true)->count();
        $appointments = Appointment::query()
            ->where('company_id', $companyId)
            ->when($from, fn ($q) => $q->whereDate('scheduled_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('scheduled_at', '<=', $to))
            ->count();

        $payrollPaid = (float) Payslip::query()
            ->where('company_id', $companyId)
            ->where('status', 'paid')
            ->when($from, fn ($q) => $q->whereDate('period_start', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('period_end', '<=', $to))
            ->sum('net_pay');

        return [
            'active_staff' => $activeStaff,
            'appointments' => $appointments,
            'payroll_paid' => round($payrollPaid, 2),
        ];
    }

    public function revenueByStaff(int $companyId, ?string $from, ?string $to, int $limit = 15): Collection
    {
        return SaleItem::query()
            ->select('staff_id', DB::raw('COUNT(DISTINCT sale_items.sale_id) as sales_count'), DB::raw('SUM(sale_items.line_total) as revenue'))
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->with('staff')
            ->where('sales.company_id', $companyId)
            ->where('sales.status', SaleStatusEnum::Paid->value)
            ->whereNotNull('sale_items.staff_id')
            ->when($from, fn ($q) => $q->whereDate('sales.paid_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('sales.paid_at', '<=', $to))
            ->groupBy('staff_id')
            ->orderByDesc('revenue')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'staff_id' => $row->staff_id,
                'name' => $row->staff?->name ?? 'Staff',
                'sales_count' => (int) $row->sales_count,
                'revenue' => (float) $row->revenue,
            ]);
    }

    public function appointmentsByStaff(int $companyId, ?string $from, ?string $to): Collection
    {
        return Appointment::query()
            ->select('staff_id', DB::raw('COUNT(*) as count'))
            ->with('staff')
            ->where('company_id', $companyId)
            ->whereNotNull('staff_id')
            ->when($from, fn ($q) => $q->whereDate('scheduled_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('scheduled_at', '<=', $to))
            ->groupBy('staff_id')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => [
                'staff_id' => $row->staff_id,
                'name' => $row->staff?->name ?? 'Staff',
                'appointments' => (int) $row->count,
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function inventorySummary(int $companyId, ?string $from, ?string $to, ?int $branchId = null): array
    {
        $stockQuery = BranchProductStock::query()
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->whereHas('product', fn ($q) => $q->where('is_active', true));

        $stockItems = (clone $stockQuery)->with('product')->get();
        $stockValue = $stockItems->sum(fn ($s) => (float) $s->quantity_on_hand * (float) ($s->product?->cost_price ?? 0));

        $lowStock = $stockItems->filter(function ($stock) {
            $level = $stock->reorder_level_override ?? $stock->product?->reorder_level ?? 0;

            return $level > 0 && (float) $stock->quantity_on_hand <= (float) $level;
        })->count();

        $purchases = (float) StockPurchase::query()
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($from, fn ($q) => $q->whereDate('ordered_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('ordered_at', '<=', $to))
            ->whereIn('status', ['ordered', 'partial', 'received'])
            ->sum('total_amount');

        $consumption = (float) StockMovement::query()
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->where('type', 'consumption')
            ->when($from, fn ($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('created_at', '<=', $to))
            ->sum(DB::raw('ABS(quantity)'));

        return [
            'product_count' => $stockItems->unique('product_id')->count(),
            'stock_value' => round($stockValue, 2),
            'low_stock_count' => $lowStock,
            'purchases_total' => round($purchases, 2),
            'consumption_units' => round($consumption, 3),
        ];
    }

    public function stockMovementsByType(int $companyId, ?string $from, ?string $to, ?int $branchId = null): Collection
    {
        return StockMovement::query()
            ->select('type', DB::raw('COUNT(*) as count'), DB::raw('SUM(ABS(quantity)) as quantity'))
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($from, fn ($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('created_at', '<=', $to))
            ->groupBy('type')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => [
                'type' => $row->type,
                'count' => (int) $row->count,
                'quantity' => (float) $row->quantity,
            ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function financialSummary(int $companyId, ?string $from, ?string $to, ?int $branchId = null): array
    {
        $sales = $this->salesSummary($companyId, $from, $to, $branchId);

        $expenses = (float) Expense::query()
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($from, fn ($q) => $q->whereDate('expense_date', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('expense_date', '<=', $to))
            ->sum('total_amount');

        $payroll = (float) Payslip::query()
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->whereIn('status', ['approved', 'paid'])
            ->when($from, fn ($q) => $q->whereDate('period_start', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('period_end', '<=', $to))
            ->sum('net_pay');

        $inventoryPurchases = (float) StockPurchase::query()
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($from, fn ($q) => $q->whereDate('ordered_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('ordered_at', '<=', $to))
            ->whereIn('status', ['ordered', 'partial', 'received'])
            ->sum('total_amount');

        $revenue = $sales['total_revenue'];
        $totalOut = $expenses + $payroll;

        return [
            'revenue' => $revenue,
            'expenses' => round($expenses, 2),
            'payroll' => round($payroll, 2),
            'inventory_purchases' => round($inventoryPurchases, 2),
            'total_outflow' => round($totalOut + $inventoryPurchases, 2),
            'net_profit' => round($revenue - $totalOut, 2),
            'profit_margin' => $revenue > 0 ? round((($revenue - $totalOut) / $revenue) * 100, 1) : 0,
        ];
    }

    /**
     * @return array{labels: array<int, string>, revenue: array<int, float>, expenses: array<int, float>}
     */
    public function financialMonthly(int $companyId, int $months = 6): array
    {
        $labels = [];
        $revenue = [];
        $expenses = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $start = $date->copy()->startOfMonth()->toDateString();
            $end = $date->copy()->endOfMonth()->toDateString();
            $labels[] = $date->format('M Y');

            $revenue[] = (float) $this->saleBase($companyId, $start, $end)->sum('total_amount');
            $expenses[] = (float) Expense::query()
                ->where('company_id', $companyId)
                ->whereDate('expense_date', '>=', $start)
                ->whereDate('expense_date', '<=', $end)
                ->sum('total_amount');
        }

        return ['labels' => $labels, 'revenue' => $revenue, 'expenses' => $expenses];
    }

    /**
     * @return array<string, mixed>
     */
    public function vatSummary(int $companyId, ?string $from, ?string $to, ?int $branchId = null): array
    {
        $outputVat = (float) $this->saleBase($companyId, $from, $to, $branchId)->sum('vat_amount');
        $outputSubtotal = (float) $this->saleBase($companyId, $from, $to, $branchId)->sum('subtotal');

        $inputVat = (float) Expense::query()
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($from, fn ($q) => $q->whereDate('expense_date', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('expense_date', '<=', $to))
            ->sum('vat_amount');

        $purchaseVat = (float) StockPurchase::query()
            ->where('company_id', $companyId)
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($from, fn ($q) => $q->whereDate('ordered_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('ordered_at', '<=', $to))
            ->whereIn('status', ['ordered', 'partial', 'received'])
            ->sum('vat_amount');

        $totalInput = $inputVat + $purchaseVat;

        return [
            'output_vat' => round($outputVat, 2),
            'output_taxable' => round($outputSubtotal, 2),
            'input_vat_expenses' => round($inputVat, 2),
            'input_vat_purchases' => round($purchaseVat, 2),
            'total_input_vat' => round($totalInput, 2),
            'net_vat_payable' => round($outputVat - $totalInput, 2),
        ];
    }

    /**
     * @return array{labels: array<int, string>, output: array<int, float>, input: array<int, float>}
     */
    public function vatMonthly(int $companyId, int $months = 6): array
    {
        $labels = [];
        $output = [];
        $input = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $start = $date->copy()->startOfMonth()->toDateString();
            $end = $date->copy()->endOfMonth()->toDateString();
            $labels[] = $date->format('M Y');

            $vat = $this->vatSummary($companyId, $start, $end);
            $output[] = $vat['output_vat'];
            $input[] = $vat['total_input_vat'];
        }

        return ['labels' => $labels, 'output' => $output, 'input' => $input];
    }

    public function salesVatByRate(int $companyId, ?string $from, ?string $to): Collection
    {
        return SaleItem::query()
            ->select('vat_rate', DB::raw('SUM(line_subtotal) as taxable'), DB::raw('SUM(line_vat) as vat'))
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->where('sales.company_id', $companyId)
            ->where('sales.status', SaleStatusEnum::Paid->value)
            ->when($from, fn ($q) => $q->whereDate('sales.paid_at', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('sales.paid_at', '<=', $to))
            ->groupBy('vat_rate')
            ->orderByDesc('vat')
            ->get()
            ->map(fn ($row) => [
                'vat_rate' => (float) $row->vat_rate,
                'taxable_amount' => (float) $row->taxable,
                'vat_amount' => (float) $row->vat,
            ]);
    }
}
