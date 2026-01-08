<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('parking_lots', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->text('address');
            $table->integer('available_slots');
            $table->integer('total_slots');
            $table->string('type'); // motor, mobil, sepeda
            $table->string('category'); // mahasiswa, dosen, tamu
            $table->text('description')->nullable();
            $table->json('facilities')->nullable();
            $table->string('opening_hours');
            $table->string('gate_access');
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('parking_lots');
    }
};