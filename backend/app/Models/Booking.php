<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'booking_code',
        'user_id',
        'parking_lot_id',
        'vehicle_number',
        'vehicle_type',
        'purpose',
        'status',
        'expires_at',
    ];
}
