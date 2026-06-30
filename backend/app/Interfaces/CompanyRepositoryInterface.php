<?php

namespace App\Interfaces;

use App\Models\Company;

interface CompanyRepositoryInterface
{
    public function getDefault(): ?Company;

    public function findById(int $id): ?Company;
}
