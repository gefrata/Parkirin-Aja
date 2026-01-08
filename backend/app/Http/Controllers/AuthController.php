<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Mail\OtpMail;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);
    
        $user = User::where('email', $request->login)
            ->orWhere('username', $request->login)
            ->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Kredensial tidak valid'], 401);
        }
    
        $this->generateOtp($user, 'login');
        
        // Generate identifier untuk login juga
        $otpIdentifier = encrypt([
            'user_id' => $user->id,
            'email' => $user->email,
            'purpose' => 'login',
            'expires_at' => now()->addMinutes(30)->timestamp
        ]);
        
        return response()->json([
            'message' => 'OTP login dikirim ke email',
            'otp_identifier' => $otpIdentifier,
            'otp_required' => true
        ]);
    }
    


    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:4|max:20|alpha_dash|unique:users,username',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'phone' => 'required|string|max:15',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }
    
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
        ]);
    
        $this->generateOtp($user, 'register');
        
        // Generate encrypted identifier untuk OTP verification
        $otpIdentifier = encrypt([
            'user_id' => $user->id,
            'email' => $user->email,
            'purpose' => 'register',
            'expires_at' => now()->addMinutes(30)->timestamp
        ]);
        
        return response()->json([
            'message' => 'OTP verifikasi dikirim ke email',
            'otp_identifier' => $otpIdentifier,
            'otp_required' => true
        ], 201);
    }
    


    public function verifyOtp(Request $request)
    {
        \Log::info('=== OTP VERIFICATION REQUEST ===');
        \Log::info('Request data:', $request->all());
        
        $request->validate([
            'otp' => 'required|digits:6',
            'otp_identifier' => 'required|string'
        ]);
    
        try {
            // Decrypt identifier
            $identifier = decrypt($request->otp_identifier);
            \Log::info('Decrypted identifier:', $identifier);
            
            // Check expiration
            if (now()->timestamp > $identifier['expires_at']) {
                \Log::warning('OTP identifier expired');
                return response()->json(['message' => 'OTP session expired'], 401);
            }
            
            $user = User::find($identifier['user_id']);
            \Log::info('Found user:', [$user ? $user->id : 'NOT FOUND']);
            
            if (!$user) {
                return response()->json(['message' => 'User tidak ditemukan'], 404);
            }
    
            \Log::info('User OTP code exists:', [$user->otp_code ? 'YES' : 'NO']);
            \Log::info('OTP expires at:', [$user->otp_expires_at]);
            \Log::info('Current time:', [now()]);
            
            if (!$user->otp_code || now()->gt($user->otp_expires_at)) {
                \Log::warning('OTP invalid or expired');
                return response()->json(['message' => 'OTP telah kadaluarsa'], 400);
            }
    
            $otpValid = Hash::check($request->otp, $user->otp_code);
            \Log::info('OTP hash check:', [$otpValid ? 'VALID' : 'INVALID']);
            
            if (!$otpValid) {
                return response()->json(['message' => 'OTP salah'], 422);
            }
    
            // Verifikasi email untuk register context
            if ($user->otp_context === 'register') {
                $user->update([
                    'email_verified_at' => now(),
                ]);
                \Log::info('Email verified for user:', [$user->id]);
            }
    
            // Bersihkan OTP
            $user->update([
                'otp_code' => null,
                'otp_expires_at' => null,
                'otp_context' => null,
            ]);
    
            $token = $user->createToken('access-token')->plainTextToken;
            \Log::info('Token created for user:', [$user->id]);
    
            return response()->json([
                'message' => 'OTP valid',
                'access_token' => $token,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'name' => $user->name,
                    'email_verified_at' => $user->email_verified_at,
                ]
            ]);
            
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            \Log::error('Decryption error: ' . $e->getMessage());
            return response()->json(['message' => 'Invalid OTP identifier'], 401);
        } catch (\Exception $e) {
            \Log::error('OTP verification error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'otp_identifier' => 'required|string'
        ]);
    
        try {
            $identifier = decrypt($request->otp_identifier);
            
            // Check expiration
            if (now()->timestamp > $identifier['expires_at']) {
                return response()->json(['message' => 'OTP session expired'], 401);
            }
            
            $user = User::find($identifier['user_id']);
            
            if (!$user) {
                return response()->json(['message' => 'User tidak ditemukan'], 404);
            }
    
            if ($user->otp_last_sent_at && now()->diffInSeconds($user->otp_last_sent_at) < 60) {
                return response()->json([
                    'message' => 'Tunggu 60 detik sebelum mengirim ulang OTP'
                ], 429);
            }
    
            $this->generateOtp($user, $user->otp_context ?? 'register');
            
            // Generate new identifier dengan extended expiry
            $newIdentifier = encrypt([
                'user_id' => $user->id,
                'email' => $user->email,
                'purpose' => $user->otp_context ?? 'register',
                'expires_at' => now()->addMinutes(30)->timestamp
            ]);
            
            return response()->json([
                'message' => 'OTP berhasil dikirim ulang',
                'otp_identifier' => $newIdentifier
            ]);
            
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return response()->json(['message' => 'Invalid OTP identifier'], 401);
        }
    }
    
    


        public function me(Request $request)
        {
            return response()->json($request->user());
        }

        public function logout(Request $request)
        {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout berhasil'
            ]);
        }

    /* ================================
       GOOGLE LOGIN
       ================================ */

        public function redirectToGoogle()
        {
            return Socialite::driver('google')
                ->stateless()
                ->redirect();
        }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')
            ->stateless()
            ->user();
    
        $user = User::where('google_id', $googleUser->id)
            ->orWhere('email', $googleUser->email)
            ->first();
    
        if (!$user) {
            $user = User::create([
                'name'      => $googleUser->name,
                'email'     => $googleUser->email,
                'google_id' => $googleUser->id,
                'username'  => $this->generateUniqueUsername($googleUser->name),
                'password'  => bcrypt(Str::random(32)),
            ]);
        } else {
            $user->update([
                'google_id' => $googleUser->id,
            ]);
        }
    
        $token = $user->createToken('google-login')->plainTextToken;
    
        return redirect(
            config('app.frontend_url') .
            '/auth/callback?token=' . $token
        );
    }

    private function generateUniqueUsername(string $name): string
    {
        $base = 'pa_' . Str::slug($name, '_');
        $base = substr($base, 0, 20);
        $reserved = ['admin', 'support', 'root'];

            if (in_array($base, $reserved)) {
            $base .= '_' . Str::random(3);
        }
        
        $username = $base;

        while (User::where('username', $username)->exists()) {
            $username = $base . '_' . Str::lower(Str::random(4));
        }

        return $username;
    }


    private function generateOtp(User $user, string $context)
{
    $otp = random_int(100000, 999999);

    $user->update([
        'otp_code' => Hash::make($otp),
        'otp_expires_at' => now()->addMinutes(5),
        'otp_context' => $context,
        'otp_last_sent_at' => now(),
    ]);

    Mail::to($user->email)->send(new OtpMail($otp));
}

public function store(Request $request)
{
    $user = $request->user(); // ← HARUS ADA

    if (!$user) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 401);
    }

    $booking = Booking::create([
        'user_id' => $user->id,
        'parking_lot_id' => $request->parking_lot_id,
        'vehicle_number' => $request->vehicle_number,
        'vehicle_type' => $request->vehicle_type,
        'purpose' => $request->purpose,
    ]);

    return response()->json([
        'success' => true,
        'booking_id' => $booking->id,
    ]);
}


}
