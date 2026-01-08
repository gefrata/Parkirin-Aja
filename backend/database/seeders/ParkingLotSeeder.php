<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ParkingLot;

class ParkingLotSeeder extends Seeder
{
    public function run()
    {
        $parkingLots = [
            [
                'name' => 'Parkir Motor - Gerbang Utama',
                'location' => 'Politeknik Negeri Batam',
                'address' => 'Depan Gedung Rektorat, Polibatam',
                'available_slots' => 120,
                'total_slots' => 150,
                'type' => 'motor',
                'category' => 'mahasiswa',
                'description' => 'Parkir motor utama untuk mahasiswa - dekat gerbang utama',
                'facilities' => json_encode(['Teras Teduh', 'CCTV', 'Parkir Aman', 'Gratis']),
                'opening_hours' => '06:00 - 23:00',
                'gate_access' => 'Gerbang utama 06:00-23:00',
                'priority' => 'high',
                'is_active' => true,
            ],
            // Tambahkan data lainnya sesuai kebutuhan
        ];

        foreach ($parkingLots as $parkingLot) {
            ParkingLot::create($parkingLot);
        }
    }
}