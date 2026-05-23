<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\EmailsController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\SubscriptionController;
use Illuminate\Support\Facades\Route;

// Public auth routes — rate limited to 5 req/min per IP
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Contact form — rate limited to 3 submissions per 5 min per IP
Route::middleware('throttle:3,5')->post('/contact', [ContactController::class, 'send']);

// Public settings (GA4 ID + coming soon config)
Route::get('/settings', [SettingsController::class, 'index']);

// Newsletter subscription — rate limited to 5 req/min per IP
Route::middleware('throttle:5,1')->post('/subscribe', [NewsletterController::class, 'store']);

// Unsubscribe via email link (public, no auth required)
Route::get('/unsubscribe', [SubscriptionController::class, 'unsubscribe']);

// Protected admin routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/verify-password', [AuthController::class, 'verifyPassword']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [AuthController::class, 'updateProfile']);
    Route::patch('/settings', [SettingsController::class, 'update']);
    Route::get('/emails', [EmailsController::class, 'index']);
    Route::get('/emails/{id}', [EmailsController::class, 'show']);
    Route::post('/emails/{id}/reply', [EmailsController::class, 'reply']);
    Route::delete('/emails/{id}', [EmailsController::class, 'destroy']);
    Route::post('/emails/block', [EmailsController::class, 'block']);
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/subscriptions/{id}/send', [SubscriptionController::class, 'send']);
    Route::delete('/subscriptions/{id}', [SubscriptionController::class, 'destroy']);
});
