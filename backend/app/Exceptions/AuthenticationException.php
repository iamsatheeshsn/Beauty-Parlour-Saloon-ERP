<?php

namespace App\Exceptions;

class AuthenticationException extends ApiException
{
    public function __construct(string $message = 'Invalid credentials')
    {
        parent::__construct($message, 401);
    }
}
