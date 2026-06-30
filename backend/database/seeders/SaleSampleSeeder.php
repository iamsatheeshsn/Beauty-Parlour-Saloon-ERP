<?php

namespace Database\Seeders;

use App\Enums\SaleStatusEnum;
use App\Models\Branch;
use App\Models\Company;
use App\Models\Customer;
use App\Models\PaymentMethod;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\SalonService;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class SaleSampleSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        if (Sale::query()->where('company_id', $company->id)->where('code', 'like', 'DEMO-%')->exists()) {
            return;
        }

        $branch = Branch::query()->where('company_id', $company->id)->where('code', 'HQ')->first();
        $soldBy = User::query()->where('email', 'reception@luxebeauty.ae')->first();
        $stylist = User::query()->where('email', 'staff@luxebeauty.ae')->first();
        $cash = PaymentMethod::query()->where('company_id', $company->id)->where('code', 'CASH')->first();
        $card = PaymentMethod::query()->where('company_id', $company->id)->where('code', 'CARD')->first();

        $customers = Customer::query()->where('company_id', $company->id)->limit(8)->get();
        if ($customers->isEmpty()) {
            return;
        }

        $services = SalonService::query()
            ->where('company_id', $company->id)
            ->where('is_active', true)
            ->get()
            ->keyBy('code');

        /** @var array<int, list<array{service: string, qty?: int}>> $dailyPlans */
        $dailyPlans = [
            6 => [
                ['service' => 'SRV0001'],
                ['service' => 'SRV0004'],
                ['service' => 'SRV0013', 'qty' => 2],
            ],
            5 => [
                ['service' => 'SRV0006'],
                ['service' => 'SRV0001'],
            ],
            4 => [
                ['service' => 'SRV0002'],
                ['service' => 'SRV0005'],
                ['service' => 'SRV0013'],
            ],
            3 => [
                ['service' => 'SRV0003'],
                ['service' => 'SRV0008'],
            ],
            2 => [
                ['service' => 'SRV0001'],
                ['service' => 'SRV0004'],
                ['service' => 'SRV0012'],
            ],
            1 => [
                ['service' => 'SRV0002'],
                ['service' => 'SRV0007'],
                ['service' => 'SRV0005'],
            ],
            0 => [
                ['service' => 'SRV0006'],
                ['service' => 'SRV0001'],
                ['service' => 'SRV0009'],
            ],
        ];

        /** Extra sales in the last 30 days to boost top-services ranking */
        $extraPlans = [
            ['days_ago' => 10, 'services' => ['SRV0002', 'SRV0001']],
            ['days_ago' => 14, 'services' => ['SRV0002', 'SRV0006']],
            ['days_ago' => 18, 'services' => ['SRV0003', 'SRV0008']],
            ['days_ago' => 22, 'services' => ['SRV0005', 'SRV0004']],
            ['days_ago' => 26, 'services' => ['SRV0002', 'SRV0010']],
        ];

        $invoice = 1;

        foreach ($dailyPlans as $daysAgo => $lines) {
            $this->createDemoSale(
                companyId: $company->id,
                branchId: $branch?->id,
                customer: $customers[$invoice % $customers->count()],
                soldBy: $soldBy?->id,
                stylistId: $stylist?->id,
                paymentMethodId: $invoice % 2 === 0 ? $card?->id : $cash?->id,
                services: $services,
                lines: $lines,
                paidAt: Carbon::today()->subDays($daysAgo)->setHour(10 + ($invoice % 6))->setMinute(15),
                code: sprintf('DEMO-INV%s-%03d', now()->format('Y'), $invoice++)
            );
        }

        foreach ($extraPlans as $plan) {
            $lineItems = array_map(
                fn (string $code) => ['service' => $code],
                $plan['services']
            );

            $this->createDemoSale(
                companyId: $company->id,
                branchId: $branch?->id,
                customer: $customers[$invoice % $customers->count()],
                soldBy: $soldBy?->id,
                stylistId: $stylist?->id,
                paymentMethodId: $card?->id ?? $cash?->id,
                services: $services,
                lines: $lineItems,
                paidAt: Carbon::today()->subDays($plan['days_ago'])->setHour(14)->setMinute(30),
                code: sprintf('DEMO-INV%s-%03d', now()->format('Y'), $invoice++)
            );
        }
    }

    /**
     * @param  \Illuminate\Support\Collection<string, SalonService>  $services
     * @param  list<array{service: string, qty?: int}>  $lines
     */
    private function createDemoSale(
        int $companyId,
        ?int $branchId,
        Customer $customer,
        ?int $soldBy,
        ?int $stylistId,
        ?int $paymentMethodId,
        $services,
        array $lines,
        Carbon $paidAt,
        string $code
    ): void {
        $subtotal = 0.0;
        $vatAmount = 0.0;
        $itemRows = [];

        foreach ($lines as $index => $line) {
            $service = $services->get($line['service']);
            if (! $service) {
                continue;
            }

            $qty = $line['qty'] ?? 1;
            $unitPrice = (float) $service->price;
            $lineSubtotal = round($unitPrice * $qty, 2);
            $lineVat = round($lineSubtotal * ((float) $service->vat_rate / 100), 2);
            $lineTotal = $service->vat_inclusive ? $lineSubtotal : round($lineSubtotal + $lineVat, 2);

            $subtotal += $lineTotal;
            $vatAmount += $lineVat;

            $itemRows[] = [
                'line_type' => 'service',
                'salon_service_id' => $service->id,
                'staff_id' => $stylistId,
                'description' => $service->name,
                'quantity' => $qty,
                'unit_price' => $unitPrice,
                'vat_rate' => $service->vat_rate,
                'vat_inclusive' => (bool) $service->vat_inclusive,
                'line_subtotal' => $lineSubtotal,
                'line_vat' => $lineVat,
                'line_total' => $lineTotal,
                'sort_order' => $index + 1,
            ];
        }

        if ($itemRows === []) {
            return;
        }

        $subtotal = round($subtotal, 2);
        $vatAmount = round($vatAmount, 2);

        $sale = Sale::query()->create([
            'company_id' => $companyId,
            'branch_id' => $branchId,
            'customer_id' => $customer->id,
            'sold_by' => $soldBy,
            'code' => $code,
            'type' => 'pos',
            'status' => SaleStatusEnum::Paid->value,
            'discount_type' => 'none',
            'discount_value' => 0,
            'subtotal' => $subtotal,
            'discount_amount' => 0,
            'vat_amount' => $vatAmount,
            'total_amount' => $subtotal,
            'amount_paid' => $subtotal,
            'currency' => 'AED',
            'vat_rate_snapshot' => 5,
            'notes' => 'Demo sale for dashboard analytics',
            'paid_at' => $paidAt,
            'created_at' => $paidAt,
            'updated_at' => $paidAt,
        ]);

        foreach ($itemRows as $row) {
            SaleItem::query()->create(['sale_id' => $sale->id, ...$row]);
        }

        if ($paymentMethodId) {
            SalePayment::query()->create([
                'sale_id' => $sale->id,
                'payment_method_id' => $paymentMethodId,
                'amount' => $subtotal,
                'reference' => 'DEMO-PAY-'.$sale->id,
                'received_by' => $soldBy,
                'status' => 'completed',
                'paid_at' => $paidAt,
            ]);
        }
    }
}
