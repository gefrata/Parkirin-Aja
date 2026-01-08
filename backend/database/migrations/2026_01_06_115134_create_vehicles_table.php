<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['motor', 'mobil', 'sepeda']);
            $table->string('license_plate');
            $table->string('brand');
            $table->string('model');
            $table->string('color');
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            
            $table->unique(['user_id', 'license_plate']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicles');
    }
};