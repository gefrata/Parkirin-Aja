<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        $vehicles = Vehicle::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $vehicles
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:motor,mobil,sepeda',
            'license_plate' => 'required|string|max:20|unique:vehicles,license_plate,NULL,id,user_id,' . $request->user()->id,
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'color' => 'required|string|max:50'
        ]);
        
        $vehicle = Vehicle::create([
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'license_plate' => strtoupper($request->license_plate),
            'brand' => $request->brand,
            'model' => $request->model,
            'color' => $request->color,
            'is_default' => Vehicle::where('user_id', $request->user()->id)->count() === 0
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil ditambahkan',
            'data' => $vehicle
        ], 201);
    }
    
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);
        
        // Cek authorization
        if ($vehicle->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
        
        $request->validate([
            'type' => 'sometimes|in:motor,mobil,sepeda',
            'license_plate' => 'sometimes|string|max:20|unique:vehicles,license_plate,' . $id . ',id,user_id,' . $request->user()->id,
            'brand' => 'sometimes|string|max:100',
            'model' => 'sometimes|string|max:100',
            'color' => 'sometimes|string|max:50',
            'is_default' => 'sometimes|boolean'
        ]);
        
        $vehicle->update($request->only(['type', 'license_plate', 'brand', 'model', 'color', 'is_default']));
        
        // Jika set as default, update yang lain
        if ($request->has('is_default') && $request->is_default) {
            Vehicle::where('user_id', $request->user()->id)
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil diperbarui',
            'data' => $vehicle
        ]);
    }
    
    public function destroy($id, Request $request)
    {
        $vehicle = Vehicle::findOrFail($id);
        
        // Cek authorization
        if ($vehicle->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }
        
        // Cek apakah kendaraan digunakan di reservasi aktif
        $activeReservations = $vehicle->reservations()
            ->where('status', 'active')
            ->exists();
            
        if ($activeReservations) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus kendaraan yang sedang digunakan dalam reservasi aktif'
            ], 400);
        }
        
        $vehicle->delete();
        
        // Jika yang dihapus adalah default, set kendaraan lain sebagai default
        if ($vehicle->is_default) {
            $newDefault = Vehicle::where('user_id', $request->user()->id)
                ->first();
                
            if ($newDefault) {
                $newDefault->update(['is_default' => true]);
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Kendaraan berhasil dihapus'
        ]);
    }
}