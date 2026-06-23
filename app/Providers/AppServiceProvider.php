<?php

namespace App\Providers;

use App\Repositories\Contracts\CaseRepositoryInterface;
use App\Repositories\Contracts\ComplaintTypeRepositoryInterface;
use App\Repositories\Contracts\RegionRepositoryInterface;
use App\Repositories\Contracts\UserAccessRepositoryInterface;
use App\Repositories\Eloquent\EloquentCaseRepository;
use App\Repositories\Eloquent\EloquentComplaintTypeRepository;
use App\Repositories\Eloquent\EloquentRegionRepository;
use App\Repositories\Eloquent\EloquentUserAccessRepository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ComplaintTypeRepositoryInterface::class, EloquentComplaintTypeRepository::class);
        $this->app->bind(CaseRepositoryInterface::class, EloquentCaseRepository::class);
        $this->app->bind(RegionRepositoryInterface::class, EloquentRegionRepository::class);
        $this->app->bind(UserAccessRepositoryInterface::class, EloquentUserAccessRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
