<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\GenderEnum;
use App\Exceptions\ApiException;
use App\Models\Customer;
use App\Repositories\CustomerRepository;
use App\Support\PhoneNumber;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CustomerService extends MasterDataService
{
    public function __construct(
        private readonly CustomerRepository $customerRepository
    ) {
        parent::__construct($customerRepository);
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => [
                'required', 'string', 'max:30',
                Rule::unique('customers', 'phone')->where(fn ($q) => $q->where('company_id', $companyId)),
            ],
            'email' => ['nullable', 'email', 'max:255'],
            'gender' => ['nullable', Rule::enum(GenderEnum::class)],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'address' => ['nullable', 'string'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'emirate_id' => ['nullable', 'integer', 'exists:emirates,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'summary' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => [
                'sometimes', 'string', 'max:30',
                Rule::unique('customers', 'phone')->where(fn ($q) => $q->where('company_id', $companyId))->ignore($id),
            ],
            'email' => ['nullable', 'email', 'max:255'],
            'gender' => ['nullable', Rule::enum(GenderEnum::class)],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'address' => ['nullable', 'string'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'emirate_id' => ['nullable', 'integer', 'exists:emirates,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'summary' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId = null, ?Request $request = null): Model
    {
        $data['phone'] = PhoneNumber::normalize($data['phone'] ?? '') ?? $data['phone'];
        $data['code'] = $this->customerRepository->nextCode($companyId ?? 0);

        return parent::create($data, $companyId, $request);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId = null, ?Request $request = null): Model
    {
        if (isset($data['phone'])) {
            $data['phone'] = PhoneNumber::normalize($data['phone']) ?? $data['phone'];
        }

        return parent::update($id, $data, $companyId, $request);
    }

    public function findByPhone(string $phone, ?int $companyId): ?Customer
    {
        if (! $companyId) {
            return null;
        }

        /** @var Customer|null $customer */
        $customer = $this->customerRepository->findByPhone($companyId, $phone);

        return $customer;
    }

    public function findWithHistory(int $id, ?int $companyId): Customer
    {
        /** @var Customer $customer */
        $customer = $this->findOrFail($id, $companyId);
        $customer->load(['notes.user', 'visits.branch', 'visits.staff', 'branch', 'emirate', 'city']);

        return $customer;
    }

    public function uploadPhoto(int $id, ?int $companyId, UploadedFile $file, Request $request): Customer
    {
        /** @var Customer $customer */
        $customer = $this->findOrFail($id, $companyId);

        if ($customer->photo) {
            Storage::disk('public')->delete($customer->photo);
        }

        $path = $file->store('customers/'.$customer->id, 'public');
        $customer->update(['photo' => $path]);

        app(ActivityLogService::class)->log(
            action: ActivityActionEnum::Update,
            userId: $request->user()?->id,
            subject: $customer,
            description: "Updated customer photo: {$customer->name}",
            properties: ['resource' => 'Customer', 'id' => $customer->id],
            request: $request
        );

        return $customer->fresh(['branch', 'emirate', 'city']);
    }

    public function deletePhoto(int $id, ?int $companyId, Request $request): Customer
    {
        /** @var Customer $customer */
        $customer = $this->findOrFail($id, $companyId);

        if ($customer->photo) {
            Storage::disk('public')->delete($customer->photo);
            $customer->update(['photo' => null]);
        }

        return $customer->fresh(['branch', 'emirate', 'city']);
    }

    public function countForCompany(?int $companyId): int
    {
        if (! $companyId) {
            return 0;
        }

        return Customer::query()->where('company_id', $companyId)->where('is_active', true)->count();
    }
}
