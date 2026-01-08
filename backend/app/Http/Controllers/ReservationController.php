<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Storage;

class ReservationController extends Controller
{
    // =========================
    // SHOW RESERVATION
    // =========================
    public function show($id)
    {
        $reservation = Reservation::with(['parkingLot', 'vehicle'])
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $reservation->id,
                'reservation_code' => $reservation->reservation_code,
                'status' => $reservation->status,
                'expires_at' => $reservation->expires_at,
                'qr_code_url' => $reservation->qr_code_path
                    ? asset('storage/'.$reservation->qr_code_path)
                    : null,
                'qr_expires_at' => $reservation->qr_expires_at,
                'parking_lot' => $reservation->parkingLot,
                'vehicle' => $reservation->vehicle,
            ]
        ]);
    }

    // =========================
    // GENERATE QR
    // =========================
    private function generateQr(Reservation $reservation)
    {
        $token   = Str::uuid()->toString();
        $expired = now()->addMinutes(15);

        $result = Builder::create()
            ->writer(new PngWriter())
            ->data($token)
            ->encoding(new Encoding('UTF-8'))
            ->size(300)
            ->margin(10)
            ->build();

        $path = "qr-codes/{$reservation->id}.png";
        Storage::disk('public')->put($path, $result->getString());

        $reservation->update([
            'qr_token'      => $token,
            'qr_code_path'  => $path,
            'qr_expires_at' => $expired,
            'expires_at'    => $expired,
        ]);
    }

    // =========================
    // CREATE RESERVATION + QR
    // =========================
    public function store(Request $request)
    {
        $reservation = Reservation::create([
            'user_id'            => auth()->id(),
            'parking_lot_id'     => $request->parking_lot_id,
            'vehicle_id'         => $request->vehicle_id,
            'reservation_code'   => 'PB-' . strtoupper(Str::random(6)),
            'purpose'            => $request->purpose,
            'estimated_duration' => $request->estimated_duration,
            'status'             => 'active'
        ]);

        $this->generateQr($reservation);
        $reservation->refresh();

        return response()->json([
            'success' => true,
            'data' => [
                ...$reservation->toArray(),
                'qr_code_url' => asset('storage/'.$reservation->qr_code_path),
                'expires_at'  => $reservation->qr_expires_at,
            ]
        ]);
    }

    // =========================
    // REFRESH QR
    // =========================
    public function refreshQr($id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not active'
            ], 400);
        }

        $this->generateQr($reservation);
        $reservation->refresh();

        return response()->json([
            'success' => true,
            'data' => [
                'qr_code_url' => asset('storage/'.$reservation->qr_code_path),
                'expires_at'  => $reservation->qr_expires_at,
            ]
        ]);
    }
}
