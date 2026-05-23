<?php

namespace App\Http\Controllers\Api;

use App\Models\NewsletterSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends NewsletterBaseController
{
    public function index(): JsonResponse
    {
        $subs = NewsletterSubscription::orderByDesc('created_at')
            ->get(['id', 'email', 'ip_address', 'created_at']);

        return response()->json($subs);
    }

    public function send(int $id, Request $request): JsonResponse
    {
        $data = $request->validate([
            'subject'           => 'required|string|max:255',
            'preview_text'      => 'nullable|string|max:500',
            'eyebrow'           => 'required|string|max:100',
            'headline'          => 'required|string|max:200',
            'intro'             => 'required|string|max:500',
            'content_title'     => 'required|string|max:200',
            'content'           => 'required|string|max:5000',
            'button_text'       => 'required|string|max:100',
            'button_url'        => 'required|url|max:500',
            'footer_brand'      => 'nullable|string|max:100',
            'website'           => 'nullable|string|max:200',
            'footer_note'       => 'nullable|string|max:300',
            'subscription_text' => 'nullable|string|max:200',
        ]);

        $sub  = NewsletterSubscription::findOrFail($id);
        $from = $this->resendFrom();

        $unsubToken = hash_hmac('sha256', $sub->email, config('app.key'));
        $unsubUrl   = url('/api/unsubscribe?email=' . rawurlencode($sub->email) . '&token=' . $unsubToken);

        $this->sendEmail([
            'from'     => $from,
            'to'       => [$sub->email],
            'subject'  => $data['subject'],
            'template' => [
                'id'        => 'engineering-digital-systems',
                'variables' => [
                    'previewText'      => $data['preview_text'] ?? '',
                    'eyebrow'          => $data['eyebrow'],
                    'headline'         => $data['headline'],
                    'intro'            => $data['intro'],
                    'contentTitle'     => $data['content_title'],
                    'content'          => $data['content'],
                    'buttonText'       => $data['button_text'],
                    'buttonUrl'        => $data['button_url'],
                    'footerBrand'      => $data['footer_brand'] ?? 'ET-TALIBI',
                    'website'          => $data['website'] ?? '',
                    'footerNote'       => $data['footer_note'] ?? '',
                    'subscriptionText' => $data['subscription_text'] ?? '',
                    'unsubscribeUrl'   => $unsubUrl,
                ],
            ],
        ]);

        return response()->json(['ok' => true]);
    }

    public function unsubscribe(Request $request): \Illuminate\Http\Response
    {
        $email = (string) $request->query('email', '');
        $token = (string) $request->query('token', '');

        $valid = $email !== ''
            && hash_equals(hash_hmac('sha256', $email, config('app.key')), $token);

        if ($valid) {
            NewsletterSubscription::where('email', $email)->delete();
        }

        [$title, $message] = $valid
            ? ["Unsubscribed", "You will no longer receive emails from us."]
            : ["Invalid link", "This unsubscribe link is invalid or has already been used."];

        return response()
            ->view('unsubscribe', compact('title', 'message'), $valid ? 200 : 400)
            ->header('Content-Type', 'text/html');
    }

    public function destroy(int $id): JsonResponse
    {
        NewsletterSubscription::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}
