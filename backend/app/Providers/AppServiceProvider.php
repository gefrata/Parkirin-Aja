<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    /**
     * Rate limiter untuk resend OTP
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('resend-otp', function (Request $request) {
            return Limit::perMinutes(10, 5)
                ->by($request->ip());
        });
    }
}
