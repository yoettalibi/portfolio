<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockedEmail;
use App\Models\EmailDeletion;
use App\Models\EmailReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Resend\Laravel\Facades\Resend;

class EmailsController extends Controller
{
    public function index(): JsonResponse
    {
        $collection = Resend::emails()->list(['limit' => 100]);

        $adminEmail = strtolower(config('mail.from.address'));
        $repliedIds = EmailReply::pluck('original_email_id')->unique()->flip()->toArray();
        $deletedIds = EmailDeletion::pluck('email_id')->flip()->toArray();

        $emails = [];
        foreach ($collection as $email) {
            // Only show emails sent TO the admin (contact form submissions)
            $to = is_array($email->to) ? $email->to : [$email->to];
            $toAddresses = array_map('strtolower', $to);
            if (!in_array($adminEmail, $toAddresses, true)) {
                continue;
            }

            $replyTo = $email->reply_to;
            $replyToEmail = is_array($replyTo) ? ($replyTo[0] ?? null) : $replyTo;

            // Skip soft-deleted emails
            if (isset($deletedIds[$email->id])) {
                continue;
            }

            $emails[] = [
                'id'         => $email->id,
                'subject'    => $email->subject,
                'from'       => $email->from,
                'reply_to'   => $replyToEmail,
                'created_at' => $email->created_at,
                'last_event' => $email->last_event,
                'has_reply'  => isset($repliedIds[$email->id]),
            ];
        }

        return response()->json(['data' => $emails]);
    }

    public function show(string $id): JsonResponse
    {
        $email   = Resend::emails()->get($id);
        $replies = EmailReply::where('original_email_id', $id)
            ->orderBy('created_at')
            ->get()
            ->map(fn($r) => [
                'id'         => $r->id,
                'body'       => $r->body,
                'created_at' => $r->created_at->toISOString(),
            ])
            ->values();

        return response()->json([
            'id'         => $email->id,
            'subject'    => $email->subject,
            'from'       => $email->from,
            'reply_to'   => is_array($email->reply_to) ? ($email->reply_to[0] ?? null) : $email->reply_to,
            'created_at' => $email->created_at,
            'last_event' => $email->last_event,
            'text'       => $email->text,
            'replies'    => $replies,
        ]);
    }

    public function reply(string $id, Request $request): JsonResponse
    {
        $data = $request->validate(['body' => 'required|string|max:5000']);

        $original = Resend::emails()->get($id);
        $replyTo  = $original->reply_to;
        $toEmail  = is_array($replyTo) ? ($replyTo[0] ?? null) : $replyTo;

        if (!$toEmail) {
            return response()->json(['error' => 'No reply address found.'], 422);
        }

        Resend::emails()->send([
            'from'    => config('mail.from.address'),
            'to'      => [$toEmail],
            'subject' => 'Re: ' . ($original->subject ?? '(no subject)'),
            'text'    => $data['body'],
        ]);

        $reply = EmailReply::create([
            'original_email_id' => $id,
            'body'              => $data['body'],
        ]);

        return response()->json([
            'ok'    => true,
            'reply' => [
                'id'         => $reply->id,
                'body'       => $reply->body,
                'created_at' => $reply->created_at->toISOString(),
            ],
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        EmailDeletion::firstOrCreate(['email_id' => $id]);
        EmailReply::where('original_email_id', $id)->delete();

        return response()->json(['ok' => true]);
    }

    public function block(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => 'required|email|max:255']);

        BlockedEmail::firstOrCreate(['email' => $data['email']]);

        return response()->json(['ok' => true]);
    }
}
