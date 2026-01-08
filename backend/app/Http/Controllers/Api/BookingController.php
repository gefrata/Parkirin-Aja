<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'parking_lot_id'   => 'required|string',
            'parking_lot_name' => 'required|string',
            'vehicle_number'   => 'required|string',
            'vehicle_type'     => 'required|string',
            'purpose'          => 'required|string',
        ]);

        // Simulasi simpan DB (sementara)
        $bookingId = Str::uuid()->toString();

        return response()->json([
            'success' => true,
            'id' => $bookingId,
            'data' => $validated,
        ], 201);
    }
}
