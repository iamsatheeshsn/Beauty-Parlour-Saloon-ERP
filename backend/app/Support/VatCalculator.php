<?php

namespace App\Support;

use App\Enums\DiscountTypeEnum;

class VatCalculator
{
    /**
     * @return array{line_subtotal: float, line_vat: float, line_total: float}
     */
    public static function lineTotals(
        float $unitPrice,
        float $vatRate,
        bool $vatInclusive,
        int $quantity = 1,
        bool $vatEnabled = true
    ): array {
        $qty = max(1, $quantity);

        if (! $vatEnabled || $vatRate <= 0) {
            $sub = round($unitPrice * $qty, 2);

            return [
                'line_subtotal' => $sub,
                'line_vat' => 0,
                'line_total' => $sub,
            ];
        }

        $rate = $vatRate / 100;

        if ($vatInclusive) {
            $lineTotal = round($unitPrice * $qty, 2);
            $lineVat = round($lineTotal - ($lineTotal / (1 + $rate)), 2);
            $lineSubtotal = round($lineTotal - $lineVat, 2);

            return [
                'line_subtotal' => $lineSubtotal,
                'line_vat' => $lineVat,
                'line_total' => $lineTotal,
            ];
        }

        $lineSubtotal = round($unitPrice * $qty, 2);
        $lineVat = round($lineSubtotal * $rate, 2);
        $lineTotal = round($lineSubtotal + $lineVat, 2);

        return [
            'line_subtotal' => $lineSubtotal,
            'line_vat' => $lineVat,
            'line_total' => $lineTotal,
        ];
    }

    public static function discountAmount(float $subtotal, DiscountTypeEnum $type, float $value): float
    {
        if ($type === DiscountTypeEnum::None || $value <= 0) {
            return 0;
        }

        if ($type === DiscountTypeEnum::Percentage) {
            return round(min($subtotal, $subtotal * ($value / 100)), 2);
        }

        return round(min($subtotal, $value), 2);
    }
}
