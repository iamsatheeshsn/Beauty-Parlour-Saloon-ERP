<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Interfaces\CompanyRepositoryInterface;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyMasterService
{
    public function __construct(
        private readonly CompanyRepositoryInterface $companyRepository,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function getForUser(Request $request): Company
    {
        $companyId = $request->user()?->company_id;

        if ($companyId) {
            $company = $this->companyRepository->findById($companyId);
            if ($company) {
                return $company->load(['countryRelation', 'emirate', 'cityRelation']);
            }
        }

        $company = $this->companyRepository->getDefault();
        if (! $company) {
            throw new ApiException('Company not found', 404);
        }

        return $company->load(['countryRelation', 'emirate', 'cityRelation']);
    }

    public function updateRules(int $id): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'trade_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'website' => ['nullable', 'url', 'max:255'],
            'address' => ['nullable', 'string'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'emirate_id' => ['nullable', 'integer', 'exists:emirates,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'trn_number' => ['nullable', 'string', 'max:20'],
            'timezone' => ['nullable', 'string', 'max:50'],
            'currency' => ['nullable', 'string', 'max:3'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Request $request, array $data): Company
    {
        $company = $this->getForUser($request);
        $company->update($data);
        $updated = $company->fresh(['countryRelation', 'emirate', 'cityRelation']);

        $this->activityLogService->log(
            action: ActivityActionEnum::Update,
            userId: $request->user()?->id,
            subject: $updated,
            description: "Updated company: {$updated->name}",
            properties: ['resource' => 'Company', 'id' => $updated->id],
            request: $request
        );

        return $updated;
    }
}
