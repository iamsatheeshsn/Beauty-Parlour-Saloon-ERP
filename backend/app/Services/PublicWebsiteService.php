<?php

namespace App\Services;

use App\Enums\RoleEnum;
use App\Exceptions\ApiException;
use App\Http\Resources\Public\PublicBlogPostResource;
use App\Http\Resources\Public\PublicFaqResource;
use App\Http\Resources\Public\PublicGalleryItemResource;
use App\Http\Resources\Public\PublicHomepageSlideResource;
use App\Http\Resources\Public\PublicProductResource;
use App\Http\Resources\Public\PublicStaffResource;
use App\Http\Resources\Public\PublicTestimonialResource;
use App\Http\Resources\SalonServiceResource;
use App\Http\Resources\ServiceCategoryResource;
use App\Http\Resources\ServicePackageResource;
use App\Interfaces\CompanyRepositoryInterface;
use App\Models\BlogPost;
use App\Models\Company;
use App\Models\Product;
use App\Models\SalonService;
use App\Models\ServiceCategory;
use App\Models\User;
use App\Repositories\ServicePackageRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use App\Support\GoogleMapsUrl;

class PublicWebsiteService
{
    public function __construct(
        private readonly CompanyRepositoryInterface $companyRepository,
        private readonly SettingsService $settingsService,
        private readonly CustomerService $customerService,
        private readonly AppointmentService $appointmentService,
        private readonly ServicePackageRepository $servicePackageRepository,
        private readonly WebsiteInquiryService $websiteInquiryService,
        private readonly HomepageSlideService $homepageSlideService,
        private readonly TestimonialService $testimonialService,
        private readonly GalleryItemService $galleryItemService,
        private readonly FaqService $faqService,
    ) {
    }

    public function resolveCompany(): Company
    {
        $company = $this->companyRepository->getDefault();

        if (! $company) {
            throw new ApiException('Salon not configured', 503);
        }

        return $company;
    }

    /**
     * @return array<string, mixed>
     */
    public function getSettings(): array
    {
        $company = $this->resolveCompany()->load([
            'emirate',
            'cityRelation',
            'branches' => fn ($q) => $q->where('is_head_office', true)->with(['emirate', 'city']),
        ]);

        $settings = $this->settingsService->getPublicWebsiteSettings($company);
        $branch = $company->branches->first();

        $phone = (string) ($settings['public_phone'] ?? '') ?: ($branch?->phone ?? $company->phone);
        $email = (string) ($settings['public_email'] ?? '') ?: ($branch?->email ?? $company->email);
        $address = (string) ($settings['public_address'] ?? '') ?: ($branch?->address ?? $company->address);

        $location = trim(collect([
            $branch?->city?->name,
            $branch?->emirate?->name ?? $company->emirate?->name,
            $company->country,
        ])->filter()->join(', '));

        if ($location === '') {
            $location = trim(collect([$company->city, $company->country])->filter()->join(', '));
        }

        $mapUrl = (string) ($settings['map_url'] ?? $settings['map_query'] ?? '');
        if ($mapUrl === '') {
            $mapUrl = trim(collect([$address, $location])->filter()->join(', '));
        }

        $businessHours = (string) ($settings['business_hours'] ?? '');
        $whatsapp = (string) ($settings['public_whatsapp'] ?? '');

        return array_merge($settings, [
            'phone' => $phone,
            'email' => $email,
            'address' => $address,
            'website' => $company->website,
            'website_name' => (string) ($settings['public_website_name'] ?? '') ?: $company->name,
            'location' => $location,
            'branch_name' => $branch?->name,
            'business_hours' => $businessHours,
            'map_url' => $mapUrl,
            'map_embed_url' => GoogleMapsUrl::toEmbedUrl($mapUrl),
            'whatsapp_url' => $this->resolveWhatsAppUrl($whatsapp),
        ]);
    }

    private function resolveWhatsAppUrl(?string $value): string
    {
        if (! $value) {
            return 'https://wa.me/971501234567';
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        $digits = preg_replace('/\D+/', '', $value);

        return $digits ? "https://wa.me/{$digits}" : 'https://wa.me/971501234567';
    }

    public function getServices(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return SalonService::query()
            ->with('category')
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function getServiceCategories(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return ServiceCategory::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function getServicePackages(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return $this->servicePackageRepository->allActive($companyId);
    }

    public function getProducts(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return Product::query()
            ->with(['category', 'brand'])
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->where('is_sellable', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function getTeam(): Collection
    {
        return $this->publicTeamQuery()->orderBy('name')->get();
    }

    public function getFeaturedTeam(): Collection
    {
        $company = $this->resolveCompany();
        $settings = $this->settingsService->getPublicWebsiteSettings($company);
        $ids = $settings['homepage_team_ids'] ?? [];

        if (! is_array($ids)) {
            $ids = [];
        }

        $ids = array_values(array_filter(array_map('intval', $ids)));
        $ids = array_slice($ids, 0, 4);

        $query = $this->publicTeamQuery();

        if ($ids === []) {
            return $query->orderBy('name')->limit(4)->get();
        }

        $members = $query->whereIn('id', $ids)->get()->keyBy('id');

        return collect($ids)
            ->map(fn (int $id) => $members->get($id))
            ->filter()
            ->values();
    }

    private function publicTeamQuery()
    {
        $companyId = $this->resolveCompany()->id;

        return User::query()
            ->with(['staffDesignation', 'department', 'roles'])
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->whereNotNull('staff_designation_id')
            ->whereDoesntHave('roles', fn ($q) => $q->whereIn('name', [
                RoleEnum::Owner->value,
                RoleEnum::Admin->value,
            ]));
    }

    public function getBlogPosts(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return BlogPost::query()
            ->where('company_id', $companyId)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->get();
    }

    public function getBlogPost(string $slug): BlogPost
    {
        $companyId = $this->resolveCompany()->id;

        $post = BlogPost::query()
            ->where('company_id', $companyId)
            ->where('slug', $slug)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->first();

        if (! $post) {
            throw new ApiException('Blog post not found', 404);
        }

        return $post;
    }

    public function getHomepageSlides(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return $this->homepageSlideService->listActive($companyId);
    }

    public function getTestimonials(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return $this->testimonialService->listActive($companyId);
    }

    public function getGallery(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return $this->galleryItemService->listActive($companyId);
    }

    public function getFaqs(): Collection
    {
        $companyId = $this->resolveCompany()->id;

        return $this->faqService->listActive($companyId);
    }

    /**
     * @return array<string, mixed>
     */
    public function inquiryRules(): array
    {
        return $this->websiteInquiryService->publicStoreRules();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{reference: string, type: string}
     */
    public function createInquiry(array $data, int $companyId): array
    {
        return $this->websiteInquiryService->createFromPublic($data, $companyId);
    }

    /**
     * @return array<string, mixed>
     */
    public function bookingRules(int $companyId): array
    {
        $company = $this->resolveCompany();
        $timezone = $company->timezone ?: config('app.timezone', 'Asia/Dubai');

        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'service_id' => [
                'required',
                'integer',
                Rule::exists('services', 'id')->where(fn ($q) => $q
                    ->where('company_id', $companyId)
                    ->where('is_active', true)),
            ],
            'scheduled_at' => [
                'required',
                'date',
                function (string $attribute, mixed $value, \Closure $fail) use ($timezone): void {
                    try {
                        $scheduled = Carbon::parse($value, $timezone);
                    } catch (\Exception) {
                        $fail('The scheduled at field must be a valid date.');

                        return;
                    }

                    if ($scheduled->lt(now($timezone))) {
                        $fail('Please choose a date and time in the future.');
                    }
                },
            ],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createBooking(array $data, Request $request): array
    {
        $company = $this->resolveCompany();
        $companyId = $company->id;

        $customer = $this->customerService->findByPhone($data['phone'], $companyId);

        if ($customer) {
            $updates = array_filter([
                'name' => $data['name'],
                'email' => $data['email'] ?? null,
            ], fn ($v) => $v !== null && $v !== '');

            if ($updates) {
                $this->customerService->update($customer->id, $updates, $companyId, $request);
                $customer->refresh();
            }
        } else {
            $customer = $this->customerService->create([
                'name' => $data['name'],
                'phone' => $data['phone'],
                'email' => $data['email'] ?? null,
                'is_active' => true,
            ], $companyId, $request);
        }

        $notes = $data['message'] ?? null;
        if ($notes) {
            $notes = 'Website booking: '.$notes;
        } else {
            $notes = 'Booked via website';
        }

        $timezone = $company->timezone ?: config('app.timezone', 'Asia/Dubai');
        $scheduledAt = Carbon::parse($data['scheduled_at'], $timezone);

        $appointment = $this->appointmentService->createBooking([
            'customer_id' => $customer->id,
            'scheduled_at' => $scheduledAt->toDateTimeString(),
            'notes' => $notes,
            'items' => [
                ['service_id' => $data['service_id']],
            ],
        ], $companyId, $request);

        return [
            'reference' => $appointment->code,
            'scheduled_at' => $appointment->scheduled_at?->toIso8601String(),
            'service' => $appointment->items->first()?->service_name,
        ];
    }

    public function formatServices(Collection $services): array
    {
        return SalonServiceResource::collection($services)->resolve();
    }

    public function formatCategories(Collection $categories): array
    {
        return ServiceCategoryResource::collection($categories)->resolve();
    }

    public function formatPackages(Collection $packages): array
    {
        return ServicePackageResource::collection($packages)->resolve();
    }

    public function formatProducts(Collection $products): array
    {
        return PublicProductResource::collection($products)->resolve();
    }

    public function formatTeam(Collection $team): array
    {
        return PublicStaffResource::collection($team)->resolve();
    }

    public function formatBlogPosts(Collection $posts): array
    {
        return PublicBlogPostResource::collection($posts)->resolve();
    }

    public function formatHomepageSlides(Collection $slides): array
    {
        return PublicHomepageSlideResource::collection($slides)->resolve();
    }

    public function formatTestimonials(Collection $testimonials): array
    {
        return PublicTestimonialResource::collection($testimonials)->resolve();
    }

    public function formatGallery(Collection $items): array
    {
        return PublicGalleryItemResource::collection($items)->resolve();
    }

    public function formatFaqs(Collection $faqs): array
    {
        return PublicFaqResource::collection($faqs)->resolve();
    }
}
