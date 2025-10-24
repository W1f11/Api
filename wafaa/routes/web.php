<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

// Authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    //  Jobs (pour tous les utilisateurs connectés)
    Route::get('/jobs', [JobController::class, 'index']); // affiche tous les jobs
    Route::get('/jobs/search', [JobController::class, 'search']);
    Route::post('/jobs', [JobController::class, 'store']); // création de job (si employer)

    //  Applications
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'store']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/jobs/{job}/applications', [ApplicationController::class, 'jobApplications']);

    //  Admin seulement
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
    });

    //  Employer seulement
    Route::middleware('role:employer')->group(function () {
        Route::post('/jobs', [JobController::class, 'store']);
    });
});
