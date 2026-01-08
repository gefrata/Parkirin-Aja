<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class QRCodeController extends Controller
{
    // Generate QR Code for reservation
    public function generateForReservation($reservationId)
    {
        $reservation = Reservation::findOrFail($reservationId);
        
        // Cek authorization
        if ($reservation->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'qr_code_url' => Storage::url($reservation->qr_code_path),
                'expires_at' => $reservation->expires_at
            ]
        ]);
    }
    
    // Scan and validate QR Code (untuk security/petugas parkir)
    public function scan(Request $request)
    {
        $request->validate([
            'qr_code_data' => 'required|string'
        ]);
        
        $qrData = json_decode($request->qr_code_data, true);
        
        if (!$qrData) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code tidak valid'
            ], 400);
        }
        
        $reservation = Reservation::where('reservation_code', $qrData['reservation_code'])
            ->with(['user', 'parkingLot', 'vehicle'])
            ->first();
            
        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak ditemukan'
            ], 404);
        }
        
        // Cek apakah QR Code expired
        if (Carbon::parse($qrData['expires_at'])->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code sudah kadaluarsa',
                'data' => [
                    'reservation' => $reservation,
                    'is_expired' => true
                ]
            ], 400);
        }
        
        // Cek apakah reservasi aktif
        if ($reservation->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Reservasi tidak aktif',
                'data' => [
                    'reservation' => $reservation,
                    'status' => $reservation->status
                ]
            ], 400);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'QR Code valid',
            'data' => [
                'reservation' => $reservation,
                'is_valid' => true,
                'remaining_time' => Carbon::parse($qrData['expires_at'])->diffForHumans(Carbon::now())
            ]
        ]);
    }
    
    // Get QR Code by reservation code
    public function getByReservationCode($reservationCode)
    {
        $reservation = Reservation::where('reservation_code', $reservationCode)
            ->firstOrFail();
            
        // Cek authorization
        if ($reservation->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
        
        if (!$reservation->qr_code_path) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code tidak tersedia'
            ], 404);
        }
        
        $filePath = Storage::disk('public')->path($reservation->qr_code_path);
        
        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code file tidak ditemukan'
            ], 404);
        }
        
        return response()->file($filePath);
    }
}