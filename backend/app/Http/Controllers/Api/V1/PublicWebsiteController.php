<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\PublicBlogPostResource;
use App\Http\Resources\Public\PublicHomepageSlideResource;
use App\Services\PublicWebsiteService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicWebsiteController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PublicWebsiteService $publicWebsiteService
    ) {
    }

    public function settings(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->getSettings(),
            'Public settings retrieved'
        );
    }

    public function services(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatServices($this->publicWebsiteService->getServices()),
            'Services retrieved'
        );
    }

    public function serviceCategories(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatCategories($this->publicWebsiteService->getServiceCategories()),
            'Service categories retrieved'
        );
    }

    public function servicePackages(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatPackages($this->publicWebsiteService->getServicePackages()),
            'Service packages retrieved'
        );
    }

    public function products(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatProducts($this->publicWebsiteService->getProducts()),
            'Products retrieved'
        );
    }

    public function team(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatTeam($this->publicWebsiteService->getTeam()),
            'Team retrieved'
        );
    }

    public function featuredTeam(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatTeam($this->publicWebsiteService->getFeaturedTeam()),
            'Featured team retrieved'
        );
    }

    public function blogPosts(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatBlogPosts($this->publicWebsiteService->getBlogPosts()),
            'Blog posts retrieved'
        );
    }

    public function blogPost(string $slug): JsonResponse
    {
        $post = $this->publicWebsiteService->getBlogPost($slug);
        $payload = (new PublicBlogPostResource($post))->resolve(request());
        $payload['content'] = $post->content;

        return $this->successResponse($payload, 'Blog post retrieved');
    }

    public function book(Request $request): JsonResponse
    {
        $company = $this->publicWebsiteService->resolveCompany();
        $validated = $request->validate($this->publicWebsiteService->bookingRules($company->id));

        $result = $this->publicWebsiteService->createBooking($validated, $request);

        return $this->successResponse($result, 'Booking request received. We will confirm shortly.', 201);
    }

    public function homepageSlides(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatHomepageSlides($this->publicWebsiteService->getHomepageSlides()),
            'Homepage slides retrieved'
        );
    }

    public function testimonials(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatTestimonials($this->publicWebsiteService->getTestimonials()),
            'Testimonials retrieved'
        );
    }

    public function gallery(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatGallery($this->publicWebsiteService->getGallery()),
            'Gallery retrieved'
        );
    }

    public function faqs(): JsonResponse
    {
        return $this->successResponse(
            $this->publicWebsiteService->formatFaqs($this->publicWebsiteService->getFaqs()),
            'FAQs retrieved'
        );
    }

    public function inquiry(Request $request): JsonResponse
    {
        $company = $this->publicWebsiteService->resolveCompany();
        $validated = $request->validate($this->publicWebsiteService->inquiryRules());

        $result = $this->publicWebsiteService->createInquiry($validated, $company->id);

        return $this->successResponse($result, 'Your inquiry has been received. We will get back to you shortly.', 201);
    }
}
