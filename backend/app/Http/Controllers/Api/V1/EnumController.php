<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PaymentMethodTypeEnum;
use App\Enums\SettingTypeEnum;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class EnumController extends Controller
{
    use ApiResponse;

    public function paymentMethodTypes(): JsonResponse
    {
        $types = collect(PaymentMethodTypeEnum::cases())->map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ]);

        return $this->successResponse($types, 'Payment method types retrieved');
    }

    public function settingTypes(): JsonResponse
    {
        $types = collect(SettingTypeEnum::cases())->map(fn ($case) => [
            'value' => $case->value,
            'label' => ucfirst($case->value),
        ]);

        return $this->successResponse($types, 'Setting types retrieved');
    }
}
