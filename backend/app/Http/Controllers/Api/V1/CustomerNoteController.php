<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerNoteResource;
use App\Services\CustomerNoteService;
use App\Services\CustomerService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerNoteController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CustomerNoteService $noteService,
        private readonly CustomerService $customerService
    ) {
    }

    public function index(Request $request, int $customerId): JsonResponse
    {
        $notes = $this->noteService->list($customerId, $this->customerService->resolveCompanyId($request));

        return $this->successResponse(CustomerNoteResource::collection($notes), 'Notes retrieved');
    }

    public function store(Request $request, int $customerId): JsonResponse
    {
        $data = $request->validate($this->noteService->storeRules());
        $note = $this->noteService->create($customerId, $data, $this->customerService->resolveCompanyId($request), $request);

        return $this->createdResponse(new CustomerNoteResource($note), 'Note created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->noteService->updateRules());
        $note = $this->noteService->update($id, $data, $this->customerService->resolveCompanyId($request), $request);

        return $this->successResponse(new CustomerNoteResource($note), 'Note updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->noteService->delete($id, $this->customerService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Note deleted');
    }
}
