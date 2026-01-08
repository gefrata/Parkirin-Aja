<?php

namespace App\Services;

use App\Models\EmailOtp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;
use Carbon\Carbon;

class OtpService
{
    public function generateAndSend($user)
    {
        $otp = random_int(100000, 999999);

        EmailOtp::updateOrCreate(
            ['user_id' => $user->id],
            [
                'otp_hash' => Hash::make($otp),
                'expires_at' => Carbon::now()->addMinutes(5),
                'last_sent_at' => now(),
                'attempts' => 0,
            ]
        );

        Mail::to($user->email)->send(new OtpMail($otp));
    }

    public function verify($user, $otp): bool
    {
        $record = EmailOtp::where('user_id', $user->id)->first();

        if (!$record) return false;
        if (now()->gt($record->expires_at)) return false;
        if ($record->attempts >= 5) return false;

        $record->increment('attempts');

        if (!Hash::check($otp, $record->otp_hash)) {
            return false;
        }

        $record->delete();
        return true;
    }
}

