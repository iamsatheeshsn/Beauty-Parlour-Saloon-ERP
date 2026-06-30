<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffDocumentResource;
use App\Services\StaffDocumentService;
use App\Services\StaffService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffDocumentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StaffDocumentService $service,
        private readonly StaffService $staffService
    ) {
    }

    public function index(Request $request, int $userId): JsonResponse
    {
        $docs = $this->service->list($userId, $this->staffService->resolveCompanyId($request));

        return $this->successResponse(StaffDocumentResource::collection($docs), 'Documents retrieved');
    }

    public function store(Request $request, int $userId): JsonResponse
    {
        $data = $request->validate($this->service->storeRules());
        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file');
        }
        $doc = $this->service->create($userId, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->createdResponse(new StaffDocumentResource($doc), 'Document created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->service->updateRules());
        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file');
        }
        $doc = $this->service->update($id, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(new StaffDocumentResource($doc), 'Document updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($id, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Document deleted');
    }
}
