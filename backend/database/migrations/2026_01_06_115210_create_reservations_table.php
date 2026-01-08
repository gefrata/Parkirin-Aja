<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('parking_lot_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->string('reservation_code')->unique();
            $table->string('purpose');
            $table->integer('estimated_duration'); // dalam menit
            $table->enum('status', ['active', 'completed', 'cancelled', 'expired'])->default('active');
            $table->timestamp('expires_at');
            $table->string('qr_code_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index('reservation_code');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reservations');
    }
};