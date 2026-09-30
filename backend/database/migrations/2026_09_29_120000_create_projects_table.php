<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            // Translatable fields stored as JSON {"en": "…", "fr": "…"}
            $table->json('title');
            $table->json('category');
            $table->json('description');
            $table->json('tags')->nullable();   // {"en": ["a"], "fr": ["b"]}
            $table->string('image_path')->nullable();
            $table->string('url')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
