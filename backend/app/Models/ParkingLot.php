<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingLot extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'address',
        'available_slots',
        'total_slots',
        'type',
        'category',
        'description',
        'facilities',
        'opening_hours',
        'gate_access',
        'priority',
        'is_active'
    ];

    protected $casts = [
        'facilities' => 'array',
        'is_active' => 'boolean'
    ];

    // Relationship dengan reservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    // Helper method untuk cek ketersediaan
    public function hasAvailableSlots()
    {
        return $this->available_slots > 0;
    }

    // Scope untuk parkir aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope berdasarkan tipe
    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Scope berdasarkan kategori
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }
}