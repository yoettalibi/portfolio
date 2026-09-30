<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Project extends Model
{
    use HasTranslations;

    // These columns are stored as JSON {"en": …, "fr": …} — do NOT add an
    // 'array' cast for them, the HasTranslations trait manages encoding.
    public array $translatable = [
        'title',
        'category',
        'description',
        'tags',
    ];

    protected $fillable = [
        'slug',
        'title',
        'category',
        'description',
        'tags',
        'image_path',
        'url',
        'featured',
        'published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'featured'   => 'boolean',
            'published'  => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
