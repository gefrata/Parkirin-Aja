<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParkingLot;

class ParkingLotController extends Controller
{
    // Get all parking lots
    public function index()
    {
        $parkingLots = ParkingLot::where('is_active', true)
            ->orderBy('priority', 'desc')
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $parkingLots
        ]);
    }
    
    // Get specific parking lot
    public function show($id)
    {
        $parkingLot = ParkingLot::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $parkingLot
        ]);
    }
}