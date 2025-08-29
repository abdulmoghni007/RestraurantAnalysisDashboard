<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\AnalyticsController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Restaurant endpoints
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

// Analytics endpoints
Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
Route::get('/analytics/top-restaurants', [AnalyticsController::class, 'topRestaurants']);
Route::get('/analytics/restaurant/{id}/trends', [AnalyticsController::class, 'orderTrends']);
