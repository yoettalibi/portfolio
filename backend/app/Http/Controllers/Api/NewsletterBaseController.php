<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Resend\Laravel\Facades\Resend;

abstract class NewsletterBaseController extends Controller
{
    /**
     * Build the "From" header from mail config.
     */
    protected function resendFrom(): string
    {
        $address = config('mail.from.address');
        $name    = config('mail.from.name');

        return $name ? "{$name} <{$address}>" : $address;
    }

    /**
     * Send an email via Resend.
     *
     * @param array<string, mixed> $payload
     */
    protected function sendEmail(array $payload): void
    {
        Resend::emails()->send($payload);
    }
}
