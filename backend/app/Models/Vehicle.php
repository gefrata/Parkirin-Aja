<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'license_plate',
        'brand',
        'model',
        'color',
        'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean'
    ];

    // Relationship dengan user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship dengan reservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    // Helper untuk format plat nomor
    public function getFormattedLicensePlateAttribute()
    {
        return strtoupper($this->license_plate);
    }

    // Scope untuk kendaraan default
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    // Scope berdasarkan tipe
    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }
}