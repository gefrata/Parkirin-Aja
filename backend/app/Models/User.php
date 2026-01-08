<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'google_id',
        'first_name',
        'last_name',
        'phone',
        'otp_code',
        'otp_expires_at',
        'otp_context',
        'otp_last_sent_at',
        'email_verified_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'otp_expires_at' => 'datetime',
        'otp_last_sent_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationship dengan vehicles
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    // Relationship dengan reservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    // Get default vehicle
    public function defaultVehicle()
    {
        return $this->vehicles()->where('is_default', true)->first();
    }

    // Get active reservations
    public function activeReservations()
    {
        return $this->reservations()
            ->where('status', Reservation::STATUS_ACTIVE)
            ->where('expires_at', '>', now())
            ->get();
    }

    // Check if user has active reservation
    public function hasActiveReservation()
    {
        return $this->activeReservations()->count() > 0;
    }
}