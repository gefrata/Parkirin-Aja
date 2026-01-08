<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class QrValidationController extends Controller
{
    public function validateQr(Request $request)
    {
        $token = $request->qr_token;

        if (!$token) {
            return response()->json([
                'valid' => false,
                'message' => 'QR token missing'
            ], 400);
        }

        $reservation = Reservation::where('qr_token', $token)->first();

        if (!$reservation) {
            return response()->json([
                'valid' => false,
                'message' => 'QR not found'
            ], 404);
        }

        if (!$reservation->qr_expires_at || now()->greaterThan($reservation->qr_expires_at)) {
            return response()->json([
                'valid' => false,
                'message' => 'QR expired'
            ], 410);
        }

        if ($reservation->status !== 'active') {
            return response()->json([
                'valid' => false,
                'message' => 'Reservation not active'
            ], 400);
        }

        // Mark as used
        $reservation->update([
            'status' => 'used',
            'used_at' => now()
        ]);

        return response()->json([
            'valid' => true,
            'reservation_id' => $reservation->id,
            'message' => 'QR valid'
        ]);
    }
}
