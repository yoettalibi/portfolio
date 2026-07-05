<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        // Generic response for every failure — never reveal which field is wrong
        // or anything about password policy.
        $invalid = fn () => response()->json(['message' => 'Invalid credentials.'], 422);

        $email    = $request->input('email', '');
        $password = $request->input('password', '');

        if (! is_string($email) || ! is_string($password) || $email === '' || $password === '') {
            return $invalid();
        }

        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            return $invalid();
        }

        // Log in via the session guard — Sanctum's stateful middleware turns
        // this into an httpOnly session cookie for the SPA. No bearer token
        // is issued or stored client-side.
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json(['message' => 'Logged in.'], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out.'], 200);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        // Always return the same message to prevent email enumeration
        Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => 'If an account with that email exists, a reset link has been sent.',
        ], 200);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => ['required', 'string'],
            'email'    => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:255', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password): void {
                $user->forceFill(['password' => Hash::make($password)])
                     ->setRememberToken(Str::random(60));
                $user->save();
                event(new PasswordReset($user));
                // Revoke all tokens after password reset
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PasswordReset) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['message' => 'Password has been reset.'], 200);
    }

    public function verifyPassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
        ]);

        if (! Hash::check($request->current_password, $request->user()->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        return response()->json(['ok' => true], 200);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'id'   => $request->user()->id,
            'name' => $request->user()->name,
        ], 200);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user  = $request->user();
        $rules = [];

        if ($request->filled('name')) {
            $rules['name'] = ['required', 'string', 'min:2', 'max:255'];
        }

        if ($request->filled('email')) {
            $rules['email'] = ['required', 'email', 'max:255', 'unique:users,email,' . $user->id];
        }

        if ($request->filled('password')) {
            $rules['current_password']      = ['required', 'string'];
            $rules['password']              = ['required', 'string', 'min:8', 'max:255', 'confirmed'];
            $rules['password_confirmation'] = ['required', 'string'];
        }

        $data = $request->validate($rules);

        if (isset($data['current_password']) && ! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        if (isset($data['name']))     $user->name     = $data['name'];
        if (isset($data['email']))    $user->email    = $data['email'];
        if (isset($data['password'])) $user->password = Hash::make($data['password']);

        $user->save();

        return response()->json([
            'id'   => $user->id,
            'name' => $user->name,
        ], 200);
    }
}
