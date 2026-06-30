<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepository;
use App\Services\ActivityLogService;
use App\Enums\ActivityActionEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductCatalogService extends MasterDataService
{
    public function __construct(
        private readonly ProductRepository $productRepository
    ) {
        parent::__construct($productRepository);
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'product_category_id' => ['nullable', 'integer', 'exists:product_categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'default_supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
            'barcode' => ['nullable', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'unit' => ['nullable', 'string', 'max:20'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'retail_price' => ['nullable', 'numeric', 'min:0'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'vat_inclusive' => ['sometimes', 'boolean'],
            'track_inventory' => ['sometimes', 'boolean'],
            'is_sellable' => ['sometimes', 'boolean'],
            'is_consumable' => ['sometimes', 'boolean'],
            'reorder_level' => ['nullable', 'numeric', 'min:0'],
            'reorder_quantity' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'product_category_id' => ['nullable', 'integer', 'exists:product_categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'default_supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
            'barcode' => ['nullable', 'string', 'max:50'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'unit' => ['nullable', 'string', 'max:20'],
            'cost_price' => ['sometimes', 'numeric', 'min:0'],
            'retail_price' => ['nullable', 'numeric', 'min:0'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'vat_inclusive' => ['sometimes', 'boolean'],
            'track_inventory' => ['sometimes', 'boolean'],
            'is_sellable' => ['sometimes', 'boolean'],
            'is_consumable' => ['sometimes', 'boolean'],
            'reorder_level' => ['nullable', 'numeric', 'min:0'],
            'reorder_quantity' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId = null, ?Request $request = null): Model
    {
        $data['code'] = $this->productRepository->nextCode($companyId ?? 0);
        $data['vat_rate'] = $data['vat_rate'] ?? 0;
        $data['unit'] = $data['unit'] ?? 'pcs';
        $data['retail_price'] = $data['retail_price'] ?? $data['cost_price'];

        return parent::create($data, $companyId, $request);
    }

    protected function buildFilters(Request $request): array
    {
        $filters = parent::buildFilters($request);

        if ($request->filled('product_category_id')) {
            $filters['product_category_id'] = $request->input('product_category_id');
        }

        if ($request->filled('brand_id')) {
            $filters['brand_id'] = $request->input('brand_id');
        }

        return $filters;
    }

    public function countActive(?int $companyId): int
    {
        if (! $companyId) {
            return 0;
        }

        return $this->productRepository->countActive($companyId);
    }

    public function uploadImage(int $id, ?int $companyId, UploadedFile $file, Request $request): Product
    {
        /** @var Product $product */
        $product = $this->findOrFail($id, $companyId);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $path = $file->store("products/{$product->id}", 'public');
        $product->update(['image' => $path]);

        app(ActivityLogService::class)->log(
            action: ActivityActionEnum::Update,
            userId: $request->user()?->id,
            subject: $product,
            description: "Updated product image: {$product->name}",
            properties: ['resource' => 'Product', 'id' => $product->id],
            request: $request
        );

        return $product->fresh(['category', 'brand']);
    }

    public function deleteImage(int $id, ?int $companyId, Request $request): Product
    {
        /** @var Product $product */
        $product = $this->findOrFail($id, $companyId);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
            $product->update(['image' => null]);
        }

        return $product->fresh(['category', 'brand']);
    }
}
