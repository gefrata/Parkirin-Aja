<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'parking_lot_id',
        'vehicle_id',
        'reservation_code',
        'purpose',
        'estimated_duration',
        'status',
    
        // 🔥 QR SYSTEM
        'qr_token',
        'qr_code_path',
        'qr_expires_at',
        'expires_at',
        'used_at',
        'notes',
    ];
    

    protected $casts = [
        'expires_at' => 'datetime',
        'estimated_duration' => 'integer'
    ];

    // Status constants
    const STATUS_ACTIVE = 'active';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_EXPIRED = 'expired';

    // Relationship dengan user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship dengan parking lot
    public function parkingLot()
    {
        return $this->belongsTo(ParkingLot::class);
    }

    // Relationship dengan vehicle
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    // Helper untuk cek apakah expired
    public function isExpired()
    {
        return $this->expires_at->isPast() || $this->status === self::STATUS_EXPIRED;
    }

    // Helper untuk cek apakah aktif
    public function isActive()
    {
        return $this->status === self::STATUS_ACTIVE && !$this->isExpired();
    }

    // Helper untuk sisa waktu (dalam menit)
    public function getRemainingTimeAttribute()
    {
        if ($this->isExpired()) {
            return 0;
        }
        
        return Carbon::now()->diffInMinutes($this->expires_at, false);
    }

    // Helper untuk format durasi
    public function getFormattedDurationAttribute()
    {
        $hours = floor($this->estimated_duration / 60);
        $minutes = $this->estimated_duration % 60;
        
        if ($hours > 0) {
            return "{$hours} jam {$minutes} menit";
        }
        
        return "{$minutes} menit";
    }

    // Scope untuk reservasi aktif
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE)
                     ->where('expires_at', '>', Carbon::now());
    }

    // Scope untuk reservasi user tertentu
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Generate QR Code URL
    public function getQrCodeUrlAttribute()
    {
        if ($this->qr_code_path) {
            return asset('storage/' . $this->qr_code_path);
        }
        
        return null;
    }
}