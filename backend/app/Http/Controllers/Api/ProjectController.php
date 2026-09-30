<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProjectController extends Controller
{
    private const LOCALES = ['en', 'fr'];
    private const TRANSLATABLE = ['title', 'category', 'description', 'tags'];

    public function index(): JsonResponse
    {
        $projects = Project::where('published', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $projects->map(fn (Project $p) => $this->serialize($p))]);
    }

    public function image(int $id): StreamedResponse|JsonResponse
    {
        $project = Project::findOrFail($id);

        if (! $project->image_path || ! Storage::disk('local')->exists($project->image_path)) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        return Storage::disk('local')->response($project->image_path, null, [
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        $projects = Project::orderBy('sort_order')->orderByDesc('created_at')->get();

        return response()->json(['data' => $projects->map(fn (Project $p) => $this->serialize($p))]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateProject($request);

        $project = new Project();
        $project->slug = $data['slug'];
        $this->fillTranslations($project, $data);
        $this->fillScalars($project, $request);

        if ($request->hasFile('image')) {
            $project->image_path = $this->storeImage($request->file('image'));
        }

        $project->save();

        return response()->json($this->serialize($project), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $data = $this->validateProject($request, $project->id);

        $project->slug = $data['slug'];
        $this->fillTranslations($project, $data);
        $this->fillScalars($project, $request);

        if ($request->hasFile('image')) {
            $this->deleteImage($project);
            $project->image_path = $this->storeImage($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $this->deleteImage($project);
            $project->image_path = null;
        }

        $project->save();

        return response()->json($this->serialize($project));
    }

    public function destroy(int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $this->deleteImage($project);
        $project->delete();

        return response()->json(null, 204);
    }

    private function validateProject(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => [
                'required', 'string', 'max:100',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('projects', 'slug')->ignore($ignoreId),
            ],
            'title.en'       => ['required', 'string', 'max:200'],
            'title.fr'       => ['nullable', 'string', 'max:200'],
            'category.en'    => ['required', 'string', 'max:100'],
            'category.fr'    => ['nullable', 'string', 'max:100'],
            'description.en' => ['required', 'string', 'max:2000'],
            'description.fr' => ['nullable', 'string', 'max:2000'],
            'tags.en.*'      => ['string', 'max:50'],
            'tags.fr.*'      => ['string', 'max:50'],
            'url'            => ['nullable', 'url', 'max:500'],
            'featured'       => ['nullable'],
            'published'      => ['nullable'],
            'sort_order'     => ['nullable', 'integer', 'min:0', 'max:9999'],
            'remove_image'   => ['nullable'],
            'image'          => ['nullable'],
        ]);
    }

    private function fillTranslations(Project $project, array $data): void
    {
        foreach (self::TRANSLATABLE as $field) {
            foreach (self::LOCALES as $locale) {
                $value = $data[$field][$locale] ?? null;
                $project->setTranslation($field, $locale, $value === [] ? null : $value);
            }
        }
    }

    private function fillScalars(Project $project, Request $request): void
    {
        $project->url        = $request->input('url') ?: null;
        $project->featured   = $request->boolean('featured');
        $project->published  = $request->boolean('published');
        $project->sort_order = (int) $request->input('sort_order', 0);
    }

    private function storeImage(UploadedFile $file): string
    {
        $source = @imagecreatefromstring((string) file_get_contents($file->getRealPath()));

        if ($source === false) {
            throw ValidationException::withMessages([
                'image' => ['The image could not be processed.'],
            ]);
        }

        $width = imagesx($source);
        if ($width > 1920) {
            $newHeight = (int) round(imagesy($source) * (1920 / $width));
            $resized   = imagecreatetruecolor(1920, $newHeight);
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            imagecopyresampled($resized, $source, 0, 0, 0, 0, 1920, $newHeight, $width, imagesy($source));
            $source = $resized;
        }

        imagepalettetotruecolor($source);
        imagealphablending($source, true);
        imagesavealpha($source, true);

        ob_start();
        imagewebp($source, null, 85);
        $webp = (string) ob_get_clean();

        $path = 'projects/' . Str::uuid() . '.webp';
        Storage::disk('local')->put($path, $webp);

        return $path;
    }

    private function deleteImage(Project $project): void
    {
        if ($project->image_path) {
            Storage::disk('local')->delete($project->image_path);
        }
    }

    private function serialize(Project $project): array
    {
        $translations = [];
        foreach (self::TRANSLATABLE as $field) {
            $raw = $project->getTranslations($field);
            foreach (self::LOCALES as $locale) {
                $translations[$field][$locale] = $raw[$locale] ?? null;
            }
        }

        return [
            'id'          => $project->id,
            'slug'        => $project->slug,
            ...$translations,
            'image_url'   => $project->image_path
                ? '/api/projects/' . $project->id . '/image?v=' . ($project->updated_at?->timestamp ?? 0)
                : null,
            'url'         => $project->url,
            'featured'    => $project->featured,
            'published'   => $project->published,
            'sort_order'  => $project->sort_order,
            'created_at'  => $project->created_at?->toISOString(),
            'updated_at'  => $project->updated_at?->toISOString(),
        ];
    }
}
