<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Base policy for authorization rules.
 */
abstract class BasePolicy
{
    use HandlesAuthorization;

    protected function isOwnerOrAdmin(User $user): bool
    {
        return $user->hasAnyRole(['owner', 'admin']);
    }
}
