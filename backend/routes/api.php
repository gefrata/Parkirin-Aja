<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ParkingLotController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\ScanController;

/*
|--------------------------------------------------------------------------
| TEST
|--------------------------------------------------------------------------
*/
Route::get('/test-api', fn() => response()->json([
    'success' => true,
    'message' => 'API route is working!',
    'timestamp' => now()->toDateTimeString(),
    'version' => '1.0.0'
]));

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class,'login']);
    Route::post('/register', [AuthController::class,'register']);
    Route::post('/verify-otp', [AuthController::class,'verifyOtp']);
    Route::post('/resend-otp', [AuthController::class,'resendOtp'])->middleware('throttle:3,1');
    Route::get('/google/redirect', [AuthController::class,'redirectToGoogle']);
    Route::get('/google/callback', [AuthController::class,'handleGoogleCallback']);
});

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('parking-lots')->group(function () {
    Route::get('/', [ParkingLotController::class,'index']);
    Route::get('/{id}', [ParkingLotController::class,'show']);
    Route::get('/type/{type}', [ParkingLotController::class,'getByType']);
    Route::get('/category/{category}', [ParkingLotController::class,'getByCategory']);
});

/*
|--------------------------------------------------------------------------
| GATE / SECURITY (QR SCAN)
|--------------------------------------------------------------------------
*/
Route::post('/scan', [ScanController::class,'scan']);   // <= QR validation endpoint

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class,'me']);
    Route::post('/logout', [AuthController::class,'logout']);

    Route::post('/booking', [BookingController::class,'store']);

    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::post('/reservations/{id}/refresh-qr', [ReservationController::class, 'refreshQr']);
    });

    /*
    |--------------------------------------------------------------------------
    | VEHICLES
    |--------------------------------------------------------------------------
    */
    Route::prefix('vehicles')->group(function () {
        Route::get('/', [VehicleController::class,'index']);
        Route::post('/', [VehicleController::class,'store']);
        Route::put('/{id}', [VehicleController::class,'update']);
        Route::delete('/{id}', [VehicleController::class,'destroy']);
        Route::put('/{id}/set-default', [VehicleController::class,'setDefault']);
    });

    /*
    |--------------------------------------------------------------------------
    | RESERVATIONS
    |--------------------------------------------------------------------------
    */
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservationController::class,'index']);
        Route::post('/', [ReservationController::class,'store']);
        Route::get('/{id}', [ReservationController::class,'show']);
        Route::put('/{id}/status', [ReservationController::class,'updateStatus']);
        Route::post('/{id}/refresh-qr', [ReservationController::class,'refreshQr']); // 🔐 QR refresh
        Route::delete('/{id}', [ReservationController::class,'destroy']);
        Route::get('/history/completed', [ReservationController::class,'completedHistory']);
        Route::get('/active', [ReservationController::class,'activeReservations']);
    });

    Route::get('/dashboard/stats', [ReservationController::class,'dashboardStats']);

    /*
    |--------------------------------------------------------------------------
    | QR CODE FILE
    |--------------------------------------------------------------------------
    */
    Route::prefix('qr-codes')->group(function () {
        Route::get('/reservation/{reservationCode}', [QRCodeController::class,'getByReservationCode']);
    });


/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/
Route::get('/health', fn() => response()->json([
    'status'=>'healthy',
    'timestamp'=>now()->toDateTimeString()
]));

/*
|--------------------------------------------------------------------------
| FALLBACK
|--------------------------------------------------------------------------
*/
Route::fallback(fn() => response()->json([
    'success'=>false,
    'message'=>'Route not found'
],404));
