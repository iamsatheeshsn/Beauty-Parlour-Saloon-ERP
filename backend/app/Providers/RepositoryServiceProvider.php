<?php

namespace App\Providers;

use App\Interfaces\ActivityLogRepositoryInterface;
use App\Interfaces\CompanyRepositoryInterface;
use App\Interfaces\SettingRepositoryInterface;
use App\Interfaces\UserRepositoryInterface;
use App\Repositories\ActivityLogRepository;
use App\Repositories\CompanyRepository;
use App\Repositories\SettingRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * @var array<class-string, class-string>
     */
    public array $bindings = [
        UserRepositoryInterface::class => UserRepository::class,
        ActivityLogRepositoryInterface::class => ActivityLogRepository::class,
        SettingRepositoryInterface::class => SettingRepository::class,
        CompanyRepositoryInterface::class => CompanyRepository::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        //
    }
}
