<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiException extends Exception
{
    public function __construct(
        string $message = 'An error occurred',
        protected int $statusCode = 400,
        protected mixed $errors = null,
        ?Exception $previous = null
    ) {
        parent::__construct($message, $statusCode, $previous);
    }

    public function render(Request $request): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $this->getMessage(),
        ];

        if ($this->errors !== null) {
            $response['errors'] = $this->errors;
        }

        return response()->json($response, $this->statusCode);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
}
