<?php

namespace App\DTOs\Auth;

use App\Models\User;

readonly class AuthResponseDTO
{
    public function __construct(
        public User $user,
        public string $token,
        public string $tokenType = 'Bearer',
    ) {
    }
}
