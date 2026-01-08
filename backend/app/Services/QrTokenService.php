<?php

namespace App\Services;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\URL;
use App\Services\QrTokenService;


class QrTokenService
{
    public static function generate(string $bookingCode): string
    {
        $payload = [
            'booking_code' => $bookingCode,
            'issued_at' => now()->timestamp,
        ];

        return Crypt::encryptString(json_encode($payload));
    }

    public static function decode(string $token): array
    {
        return json_decode(Crypt::decryptString($token), true);
    }
}


$booking = ParkingBooking::create([
    'booking_code' => 'PB-' . now()->format('ymdHis'),
    'vehicle_number' => $request->vehicle_number,
    'vehicle_type' => $request->vehicle_type,
    'purpose' => $request->purpose,
    'parking_lot_name' => $request->parking_lot_name,
    'valid_until' => now()->addHours(2),
]);

$booking->qr_token = QrTokenService::generate($booking->booking_code);
$booking->save();