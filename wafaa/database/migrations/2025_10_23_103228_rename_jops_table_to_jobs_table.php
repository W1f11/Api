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
        // If the correct table already exists, do nothing.
        if (Schema::hasTable('jobs')) {
            return;
        }

        // If the legacy table 'jops' exists, rename it to 'jobs'.
        if (Schema::hasTable('jops') && !Schema::hasTable('jobs')) {
            Schema::rename('jops', 'jobs');
            return;
        }

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('company');
            $table->string('location');
            $table->decimal('salary', 10, 2);
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
