<?php

protected $middleware = [
    \Illuminate\Http\Middleware\HandleCors::class, // Pastikan ini di paling atas
    // ... middleware lainnya
];

protected $middlewareGroups = [
    'web' => [
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        // ...
    ],
    
    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \Illuminate\Session\Middleware\StartSession::class, // TAMBAHKAN INI
    ],
];