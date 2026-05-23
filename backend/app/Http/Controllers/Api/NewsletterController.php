<?php

namespace App\Http\Controllers\Api;

use App\Models\NewsletterSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends NewsletterBaseController
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $email = strtolower(trim($data['email']));

        if (NewsletterSubscription::where('email', $email)->exists()) {
            return response()->json(['message' => 'Already subscribed.'], 409);
        }

        NewsletterSubscription::create([
            'email'      => $email,
            'ip_address' => $request->ip(),
        ]);

        try {
            $this->sendEmail([
                'from'     => $this->resendFrom(),
                'to'       => [$email],
                'template' => [
                    'id' => 'new-digital-experience',
                ],
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Welcome email failed for '.$email.': '.$e->getMessage());
        }

        return response()->json(['message' => 'Subscribed successfully.'], 201);
    }
}
