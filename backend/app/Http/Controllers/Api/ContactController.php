<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockedEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'min:2', 'max:100', 'regex:/^[a-zA-Z0-9 \-]+$/'],
            'email'      => ['required', 'email', 'max:255'],
            'subjects'   => ['required', 'array', 'min:1', 'max:10'],
            'subjects.*' => ['required', 'string', 'max:100'],
            'message'    => ['required', 'string', 'min:150', 'max:5000'],
        ]);

        if (BlockedEmail::where('email', $data['email'])->exists()) {
            return response()->json(['message' => 'Sent.'], 200);
        }

        $serviceLabels = [
            'saas'         => 'Web App or SaaS Product',
            'workflow'     => 'Automation & Workflows',
            'architecture' => 'Backend & API',
            'frontend'     => 'Interface or Dashboard',
            'business'     => 'Business Management Tool',
            'custom'       => 'Something Else',
        ];

        $subjectsText = implode(', ', array_map(
            fn(string $id) => $serviceLabels[$id] ?? $id,
            $data['subjects']
        ));
        $adminEmail   = config('mail.from.address');

        $text = "New contact from {$data['name']}\n\n"
              . "From    : {$data['name']} <{$data['email']}>\n"
              . "Services: {$subjectsText}\n\n"
              . str_repeat('-', 60) . "\n\n"
              . $data['message'];

        Mail::raw($text, function ($msg) use ($data, $subjectsText, $adminEmail) {
            $msg->to($adminEmail)
                ->replyTo($data['email'], $data['name'])
                ->subject("New contact from {$data['name']} — {$subjectsText}");
        });

        return response()->json(['message' => 'Sent.'], 200);
    }
}
