<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\Customer;
use App\Models\CustomerVisit;
use App\Repositories\CustomerVisitRepository;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class CustomerVisitService
{
    public function __construct(
        private readonly CustomerVisitRepository $visitRepository,
        private readonly CustomerService $customerService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function paginate(int $customerId, ?int $companyId, int $perPage = 15): LengthAwarePaginator
    {
        $this->customerService->findOrFail($customerId, $companyId);

        return $this->visitRepository->paginateForCustomer($customerId, $companyId ?? 0, $perPage);
    }

    public function list(int $customerId, ?int $companyId): array
    {
        $this->customerService->findOrFail($customerId, $companyId);

        return $this->visitRepository->listForCustomer($customerId, $companyId ?? 0)->all();
    }

    public function storeRules(): array
    {
        return [
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'staff_id' => ['nullable', 'integer', 'exists:users,id'],
            'visited_at' => ['required', 'date'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'services_summary' => ['nullable', 'string'],
            'amount_spent' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'staff_id' => ['nullable', 'integer', 'exists:users,id'],
            'visited_at' => ['sometimes', 'date'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'services_summary' => ['nullable', 'string'],
            'amount_spent' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(int $customerId, array $data, ?int $companyId, Request $request): CustomerVisit
    {
        /** @var Customer $customer */
        $customer = $this->customerService->findOrFail($customerId, $companyId);

        $visit = $this->visitRepository->create([
            ...$data,
            'company_id' => $companyId,
            'customer_id' => $customerId,
            'branch_id' => $data['branch_id'] ?? $customer->branch_id ?? $request->user()?->branch_id,
            'staff_id' => $data['staff_id'] ?? $request->user()?->id,
        ]);

        $this->recalculateCustomerStats($customer);
        $this->log($request, ActivityActionEnum::Create, $visit);

        return $visit;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): CustomerVisit
    {
        $visit = $this->findOrFail($id, $companyId);
        $updated = $this->visitRepository->update($visit, $data);
        $this->recalculateCustomerStats($visit->customer);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $visit = $this->findOrFail($id, $companyId);
        $customer = $visit->customer;
        $this->log($request, ActivityActionEnum::Delete, $visit);
        $this->visitRepository->delete($visit);
        $this->recalculateCustomerStats($customer);
    }

    public function findOrFail(int $id, ?int $companyId): CustomerVisit
    {
        $visit = $this->visitRepository->findById($id, $companyId ?? 0);

        if (! $visit) {
            throw new ApiException('Visit not found', 404);
        }

        return $visit;
    }

    protected function recalculateCustomerStats(Customer $customer): void
    {
        $visits = $customer->visits()->get();
        $customer->update([
            'total_visits' => $visits->count(),
            'total_spent' => $visits->sum('amount_spent'),
            'last_visit_at' => $visits->max('visited_at'),
        ]);
    }

    protected function log(Request $request, ActivityActionEnum $action, CustomerVisit $visit): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $visit->customer,
            description: "{$action->label()} visit for customer #{$visit->customer_id}",
            properties: ['resource' => 'CustomerVisit', 'id' => $visit->id, 'customer_id' => $visit->customer_id],
            request: $request
        );
    }
}
