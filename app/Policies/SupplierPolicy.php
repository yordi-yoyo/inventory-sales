<?php

namespace App\Policies;

use App\Models\Supplier;
use App\Models\User;

class SupplierPolicy
{
    public function update(User $user, Supplier $supplier): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Supplier $supplier): bool
    {
        return $user->role === 'admin';
    }
}