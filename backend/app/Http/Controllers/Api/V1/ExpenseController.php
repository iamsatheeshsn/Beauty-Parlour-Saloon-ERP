<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExpenseResource;
use App\Services\ExpenseService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ExpenseService $expenseService
    ) {
    }

    public function stats(Request $request): JsonResponse
    {
        $companyId = $this->expenseService->resolveCompanyId($request);
        $branchId = $request->input('branch_id') ? (int) $request->input('branch_id') : $request->user()?->branch_id;

        return $this->successResponse(
            $this->expenseService->stats($companyId, $branchId),
            'Expense stats retrieved'
        );
    }

    public function report(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->expenseService->report($request),
            'Expense report retrieved'
        );
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->expenseService->paginate($request);

        return $this->successResponse([
            'data' => ExpenseResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Expenses retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $expense = $this->expenseService->findOrFail($id, $this->expenseService->resolveCompanyId($request));

        return $this->successResponse(new ExpenseResource($expense), 'Expense retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->expenseService->storeRules());
        if ($request->hasFile('receipt')) {
            $data['receipt'] = $request->file('receipt');
        }

        $expense = $this->expenseService->create(
            $data,
            $this->expenseService->resolveCompanyId($request),
            $request
        );

        return $this->createdResponse(new ExpenseResource($expense), 'Expense recorded');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->expenseService->updateRules());
        if ($request->hasFile('receipt')) {
            $data['receipt'] = $request->file('receipt');
        }

        $expense = $this->expenseService->update(
            $id,
            $data,
            $this->expenseService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new ExpenseResource($expense), 'Expense updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->expenseService->delete($id, $this->expenseService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Expense deleted');
    }

    public function uploadReceipt(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->expenseService->receiptRules());
        $expense = $this->expenseService->uploadReceipt(
            $id,
            $data['receipt'],
            $this->expenseService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new ExpenseResource($expense), 'Receipt uploaded');
    }

    public function deleteReceipt(Request $request, int $id): JsonResponse
    {
        $expense = $this->expenseService->deleteReceipt(
            $id,
            $this->expenseService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new ExpenseResource($expense), 'Receipt removed');
    }
}
