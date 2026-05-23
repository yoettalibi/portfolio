# ET-TALIBI — Portfolio & Admin Dashboard

Full-stack personal portfolio with a React SPA frontend and a Laravel REST API backend. Includes a private admin dashboard, contact form, newsletter system, and Google Analytics integration.

**Live site:** [ettalibi.com](https://ettalibi.com)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Local Development](#local-development)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Features](#features)
- [Production Deployment](#production-deployment)
  - [Server Directory Layout](#server-directory-layout)
  - [Step 1 — Build the Frontend](#step-1--build-the-frontend)
  - [Step 2 — Upload the Backend](#step-2--upload-the-backend)
  - [Step 3 — Upload the API Bridge](#step-3--upload-the-api-bridge)
  - [Step 4 — Configure Backend .env](#step-4--configure-backend-env)
  - [Step 5 — Run Migrations & Seed](#step-5--run-migrations--seed)
  - [Step 6 — Set Permissions](#step-6--set-permissions)
  - [Step 7 — Cache Laravel Config](#step-7--cache-laravel-config)
  - [Step 8 — Verify](#step-8--verify)
- [Performance Notes](#performance-notes)
- [Security Notes](#security-notes)

---

## Tech Stack

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| react-router-dom | 7 | Client-side routing |
| i18next | 26 | EN / FR localisation |
| axios | 1 | HTTP client |
| zod | 4 | Schema validation |
| @fontsource-variable/inter | 5 | Self-hosted Inter font |

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| PHP | 8.3 | Runtime |
| Laravel | 13 | API framework |
| Laravel Sanctum | 4 | Bearer-token auth |
| Resend | — | Transactional email |
| spatie/laravel-translatable | 6 | Translatable models |
| MySQL | 8 | Database |

### Hosting
| | |
|-|-|
| Provider | Hostinger shared hosting |
| Web root | `public_html/` |
| Backend | `laravel_backend/` (above web root) |
| Domain | [ettalibi.com](https://ettalibi.com) |

---

## Project Structure

```
ettalibi/
├── backend/                    # Laravel 13 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   └── Middleware/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── .env.example            # ← copy to .env and fill in values
│   └── composer.json
│
├── frontend/                   # React 19 SPA
│   ├── src/
│   │   ├── auth/               # Login, AuthContext, guards
│   │   ├── dashboard/          # Admin dashboard (private)
│   │   ├── home/               # Home page sections
│   │   ├── about/
│   │   ├── work/               # Project case studies
│   │   ├── contact/
│   │   ├── legal/              # Privacy, Terms, Cookies pages
│   │   ├── hooks/              # useAnalytics, useScrollFade …
│   │   ├── i18n/               # EN / FR locale JSON files
│   │   ├── lib/                # axios instance
│   │   └── shared/             # Navbar, Footer, Layout …
│   ├── public/
│   │   ├── .htaccess           # SPA fallback + cache headers
│   │   └── sitemap.xml
│   ├── .env.example            # ← copy to .env
│   └── vite.config.ts
│
└── deploy/                     # Upload helpers
    ├── api/
    │   ├── index.php           # PHP bridge: routes /api/* → Laravel
    │   └── .htaccess
    ├── backend.env.production  # ← NOT committed (real secrets)
    └── DEPLOY_CHECKLIST.txt
```

---

## Architecture Overview

```
Browser
  │
  ├── GET /          → public_html/index.html  (React SPA)
  ├── GET /about     → public_html/index.html  (React Router)
  │
  └── /api/*         → public_html/api/index.php  (PHP bridge)
                              │
                              └── laravel_backend/public/index.php
                                        (Laravel handles the request)
```

- **Same origin** — frontend and API share `ettalibi.com`, so no CORS is needed.
- The `deploy/api/index.php` bridge adjusts `SCRIPT_NAME` so Symfony's router resolves paths correctly before booting Laravel.
- All authentication uses **Sanctum Bearer tokens** stored in `localStorage` (`_t`).

---

## Local Development

### Prerequisites

| Requirement | Version |
|-------------|---------|
| PHP | ≥ 8.3 |
| Composer | ≥ 2 |
| Node.js | ≥ 20 |
| MySQL | ≥ 8 |

---

### Backend Setup

```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Create and configure environment file
cp .env.example .env
# Edit .env — set DB_DATABASE, DB_USERNAME, DB_PASSWORD, etc.

# 3. Generate application key
php artisan key:generate

# 4. Run database migrations
php artisan migrate

# 5. Seed the admin user
php artisan db:seed --class=AdminSeeder

# 6. Start the dev server
php artisan serve
# → API available at http://localhost:8000
```

---

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# .env contains: VITE_API_URL=/api
# The Vite dev proxy will forward /api → http://localhost:8000

# 3. Start dev server
npm run dev
# → App available at http://localhost:5173
```

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Example | Description |
|----------|---------|-------------|
| `APP_KEY` | `base64:…` | Generated by `php artisan key:generate` |
| `APP_URL` | `https://ettalibi.com` | Full public URL |
| `FRONTEND_URL` | `https://ettalibi.com` | Used in CORS / email links |
| `DB_DATABASE` | `u410862470_ettalibi` | MySQL database name |
| `DB_USERNAME` | `u410862470_ettalibi` | MySQL username |
| `DB_PASSWORD` | `…` | MySQL password — **quote it** if it contains `#` |
| `SESSION_DOMAIN` | `.ettalibi.com` | Leading dot covers all subdomains |
| `RESEND_API_KEY` | `re_…` | Get one at [resend.com](https://resend.com) |
| `MAIL_FROM_ADDRESS` | `contact@ettalibi.com` | Sender address |
| `ADMIN_EMAIL` | `contact@ettalibi.com` | Admin account email (seeder) |
| `ADMIN_PASSWORD` | `…` | Admin account password (seeder) |

> **Tip:** If your DB password contains `#`, wrap it in double quotes in `.env` — otherwise PHP's dotenv parser treats `#` as a comment.

### Frontend — `frontend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Base URL for all API calls. Set to `https://yourdomain.com/api` for production builds. |

---

## API Reference

### Public endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/login` | Authenticate — returns Bearer token |
| `POST` | `/api/forgot-password` | Send password reset email |
| `POST` | `/api/reset-password` | Reset password with token |
| `POST` | `/api/contact` | Contact form submission |
| `GET` | `/api/settings` | Public settings (GA4 ID, coming-soon flag) |
| `POST` | `/api/subscribe` | Newsletter opt-in |
| `GET` | `/api/unsubscribe` | Newsletter opt-out via email link |
| `GET` | `/api/up` | Laravel health check → `{"status":"up"}` |

All public routes are rate-limited (login: 5/min, contact: 3/5 min, subscribe: 5/min).

### Protected endpoints (Bearer token required)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/logout` | Revoke current token |
| `GET` | `/api/me` | Authenticated user profile |
| `PATCH` | `/api/me` | Update profile |
| `POST` | `/api/verify-password` | Confirm password before sensitive actions |
| `PATCH` | `/api/settings` | Update site settings (GA4, coming soon…) |
| `GET` | `/api/emails` | List contact messages |
| `GET` | `/api/emails/{id}` | Get single message |
| `POST` | `/api/emails/{id}/reply` | Reply via Resend |
| `DELETE` | `/api/emails/{id}` | Delete message |
| `POST` | `/api/emails/block` | Block sender |
| `GET` | `/api/subscriptions` | List newsletter subscribers |
| `POST` | `/api/subscriptions/{id}/send` | Send email to subscriber |
| `DELETE` | `/api/subscriptions/{id}` | Remove subscriber |

---

## Features

| Feature | Notes |
|---------|-------|
| **Multilingual** | English / French via i18next with browser language detection |
| **Admin dashboard** | Manage messages, subscribers, settings |
| **Contact form** | Rate-limited, sends via Resend |
| **Newsletter** | Opt-in / opt-out with unsubscribe link in emails |
| **Coming soon mode** | Toggle per-setting, bypassed for admin routes |
| **Google Analytics** | GA4 loaded via `requestIdleCallback` — off the critical path |
| **Self-hosted fonts** | Inter Variable served from own domain — no external DNS |
| **SEO** | Sitemap, canonical URLs, Open Graph, Twitter Cards |
| **Security** | Sanctum tokens, rate limiting, generic auth errors, BCRYPT 12 rounds |

---

## Production Deployment

### Server Directory Layout

```
/home/u410862470/
├── laravel_backend/          ← Laravel project (NOT inside public_html)
│   ├── app/
│   ├── bootstrap/
│   ├── database/
│   ├── public/
│   ├── storage/              ← must be writable by PHP (755)
│   ├── vendor/
│   └── .env                  ← real production credentials
│
└── domains/ettalibi.com/
    └── public_html/          ← web root
        ├── index.html        ← from frontend/dist/
        ├── assets/           ← from frontend/dist/assets/
        ├── .htaccess         ← from frontend/dist/.htaccess
        ├── sitemap.xml
        └── api/
            ├── index.php     ← from deploy/api/index.php
            └── .htaccess     ← from deploy/api/.htaccess
```

---

### Step 1 — Build the Frontend

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

Upload **all contents of `frontend/dist/`** to `public_html/`.

---

### Step 2 — Upload the Backend

Upload the entire `backend/` folder to the server as `laravel_backend/`.

> The folder must be **one level above** `public_html/` — never inside it.

```
/home/<user>/laravel_backend/   ✅
/home/<user>/public_html/backend/  ❌
```

The `vendor/` folder must be present. Either upload it directly or run `composer install --no-dev` on the server via SSH / cPanel terminal.

---

### Step 3 — Upload the API Bridge

```
deploy/api/index.php   →  public_html/api/index.php
deploy/api/.htaccess   →  public_html/api/.htaccess
```

---

### Step 4 — Configure Backend .env

Copy `backend/.env.example` to `laravel_backend/.env` on the server and fill in every value:

```env
APP_KEY=          # php artisan key:generate
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

DB_DATABASE=      # cPanel → MySQL Databases
DB_USERNAME=      # cPanel database user
DB_PASSWORD=      # wrap in quotes if it contains special chars

SESSION_DOMAIN=.yourdomain.com

RESEND_API_KEY=   # resend.com → API Keys
MAIL_FROM_ADDRESS=contact@yourdomain.com

ADMIN_EMAIL=      # admin login
ADMIN_PASSWORD=   # admin password
```

Then generate the app key:

```bash
cd laravel_backend
php artisan key:generate
```

---

### Step 5 — Run Migrations & Seed

```bash
cd laravel_backend
php artisan migrate --force
php artisan db:seed --class=AdminSeeder
```

---

### Step 6 — Set Permissions

```bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

---

### Step 7 — Cache Laravel Config

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

### Step 8 — Verify

| Check | Expected result |
|-------|----------------|
| `https://ettalibi.com` | React SPA loads |
| `https://ettalibi.com/about` | Page loads (no 404 — SPA routing works) |
| `https://ettalibi.com/api/up` | `{"status":"up"}` |
| `https://ettalibi.com/api/settings` | JSON with settings keys |
| Admin login at `/login` | Redirects to `/dashboard` |

---

## Performance Notes

| Optimisation | How |
|-------------|-----|
| **JS code splitting** | Vite `manualChunks` → `vendor-react`, `vendor-router`, `vendor-i18n` loaded in parallel via `modulepreload` |
| **Self-hosted fonts** | `@fontsource-variable/inter` — zero external DNS, `font-display: swap`, ~48 kB Latin woff2 |
| **GTM deferred** | Injected after `window.load` → `requestIdleCallback` (5 s timeout) — never blocks LCP |
| **Asset cache** | `.htaccess` sets `max-age=31536000, immutable` for all hashed `.js` / `.css` / `.woff2` files |
| **Brotli** | Enable in Hostinger hPanel → Advanced → LiteSpeed Cache for an extra ~25 % compression |

---

## Security Notes

- **Auth errors are generic** — the login endpoint always returns the same `422` message regardless of which field is wrong, preventing user enumeration.
- **Rate limiting** on all mutation endpoints (login, contact, subscribe).
- **DB password quoting** — if the password contains `#`, it must be wrapped in double quotes in `.env` to prevent dotenv from truncating it as a comment.
- **Backend outside web root** — `laravel_backend/` is never directly accessible via HTTP.
- **No CORS needed** — frontend and API share the same origin.
- Sanctum tokens are stored in `localStorage` with opaque key names (`_t`, `_u`, `_lt`).
