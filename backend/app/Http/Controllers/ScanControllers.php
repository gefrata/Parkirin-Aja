<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ScanController extends Controller
{
    public function scan(Request $request)
    {
        $qr = $request->qr;
        [$payload,$signature] = explode('.', $qr);

        if (!hash_equals(hash_hmac('sha256',$payload,config('app.key')),$signature)) {
            return response()->json(['message'=>'QR tidak valid'],403);
        }

        $data = json_decode(base64_decode($payload), true);

        if ($data['exp'] < now()->timestamp)
            return response()->json(['message'=>'QR expired'],403);

        $reservation = Reservation::find($data['id']);

        if (!$reservation || $reservation->qr_token !== $data['token'])
            return response()->json(['message'=>'QR tidak cocok'],403);

        if ($reservation->used_at)
            return response()->json(['message'=>'QR sudah digunakan'],403);

        $reservation->update([
            'used_at'=>now(),
            'status'=>'used'
        ]);

        return response()->json(['success'=>true,'message'=>'Akses diterima']);
    }
}
