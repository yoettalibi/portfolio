<?php
/**
 * API Bridge
 * ──────────
 * Routes all  public_html/api/*  requests to the Laravel backend that
 * lives OUTSIDE public_html for security.
 *
 * Expected server directory layout:
 *   /home/<user>/backend/        ← Laravel root
 *   /home/<user>/public_html/    ← Web root
 *       api/index.php            ← this file
 *
 * Why we override SCRIPT_NAME
 * ───────────────────────────
 * Apache sets SCRIPT_NAME = /api/index.php when this file is served.
 * Symfony's Request (used by Laravel) strips the script directory (/api)
 * from REQUEST_URI to compute the path-info, so /api/settings becomes
 * /settings — and Laravel's routes (which are prefixed with "api") never
 * match.  Setting SCRIPT_NAME = /index.php makes Symfony treat the app as
 * if it lives at the domain root, so path-info stays /api/settings and
 * Laravel routes match correctly.
 */

define('LARAVEL_START', microtime(true));

// Resolve the Laravel public/ directory relative to this file.
// public_html/api/ -> up two levels -> home dir -> laravel_backend/public
$laravelPublic = realpath(__DIR__ . '/../../laravel_backend/public');

if ($laravelPublic === false || ! is_file($laravelPublic . '/index.php')) {
    http_response_code(503);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Service unavailable — backend path not found.']);
    exit;
}

// Fix server variables so Symfony/Laravel sees the correct base path.
$_SERVER['SCRIPT_NAME']     = '/index.php';
$_SERVER['PHP_SELF']        = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = $laravelPublic . '/index.php';

// Switch the working directory to Laravel's public/ folder so that any
// relative file includes inside Laravel resolve correctly.
chdir($laravelPublic);

// Boot Laravel — it handles the request and sends the response.
require $laravelPublic . '/index.php';
