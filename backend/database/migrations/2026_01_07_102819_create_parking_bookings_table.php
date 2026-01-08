<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parking_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->string('vehicle_number');
            $table->string('vehicle_type');
            $table->string('purpose');
        
            $table->string('parking_lot_name');
        
            $table->enum('status', ['CONFIRMED', 'USED', 'EXPIRED'])->default('CONFIRMED');
        
            $table->timestamp('valid_until');
        
            // Token QR (signed)
            $table->string('qr_token')->unique();
        
            $table->timestamp('used_at')->nullable();
        
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_bookings');
    }
};
