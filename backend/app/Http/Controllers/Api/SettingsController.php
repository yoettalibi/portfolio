<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Public — returns settings needed by the frontend (e.g. GA4 ID for script injection).
     */
    public function index(): JsonResponse
    {
        $keys = [
            'ga4_id',
            'coming_soon_enabled',
            'coming_soon_title',
            'coming_soon_desc',
            'coming_soon_launch_date',
            'coming_soon_social_github',
            'coming_soon_social_linkedin',
            'coming_soon_social_instagram',
        ];

        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        return response()->json([
            'ga4_id'                       => $settings['ga4_id'] ?? null,
            'coming_soon_enabled'          => $settings['coming_soon_enabled'] ?? '0',
            'coming_soon_title'            => $settings['coming_soon_title'] ?? null,
            'coming_soon_desc'             => $settings['coming_soon_desc'] ?? null,
            'coming_soon_launch_date'      => $settings['coming_soon_launch_date'] ?? null,
            'coming_soon_social_github'    => $settings['coming_soon_social_github'] ?? null,
            'coming_soon_social_linkedin'  => $settings['coming_soon_social_linkedin'] ?? null,
            'coming_soon_social_instagram' => $settings['coming_soon_social_instagram'] ?? null,
        ]);
    }

    /**
     * Auth-protected — update settings from the dashboard.
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ga4_id'                       => ['sometimes', 'nullable', 'string', 'max:30', 'regex:/^(G-[A-Z0-9]{4,20})?$/'],
            'coming_soon_enabled'          => ['sometimes', 'nullable', 'boolean'],
            'coming_soon_title'            => ['sometimes', 'nullable', 'string', 'max:200'],
            'coming_soon_desc'             => ['sometimes', 'nullable', 'string', 'max:500'],
            'coming_soon_launch_date'      => ['sometimes', 'nullable', 'date'],
            'coming_soon_social_github'    => ['sometimes', 'nullable', 'url', 'max:300'],
            'coming_soon_social_linkedin'  => ['sometimes', 'nullable', 'url', 'max:300'],
            'coming_soon_social_instagram' => ['sometimes', 'nullable', 'url', 'max:300'],
        ]);

        foreach ($data as $key => $value) {
            $stored = ($key === 'coming_soon_enabled')
                ? ($value ? '1' : '0')
                : $value;

            Setting::updateOrCreate(['key' => $key], ['value' => $stored]);
        }

        return response()->json(['message' => 'Settings saved.'], 200);
    }
}
