<?php

namespace App\DTOs\Auth;

readonly class LoginDTO
{
    public function __construct(
        public string $email,
        public string $password,
        public ?string $deviceName = null,
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'],
            password: $data['password'],
            deviceName: $data['device_name'] ?? null,
        );
    }
}
