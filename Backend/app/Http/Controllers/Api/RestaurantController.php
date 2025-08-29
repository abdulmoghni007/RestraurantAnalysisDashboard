<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;


class RestaurantController extends Controller
{

    public function index(Request $request)
    {
        try {
            $query = Restaurant::query();

            if ($search = $request->input('search')) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('cuisine_type', 'like', "%{$search}%");
            }

            $sortBy = $request->input('sort_by', 'name');
            $sortOrder = $request->input('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            $perPage = $request->input('per_page', 10);
            return response()->json($query->paginate($perPage));

        } catch (\Exception $e) {
            // Log the actual error for debugging
            Log::error('Error fetching restaurants: ' . $e->getMessage());

            // Return a generic error response to the user
            return response()->json([
                'error' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // The closure inside remember() is where the exception can happen
            $restaurant = Cache::remember("restaurant_{$id}", 3600, function() use ($id) {
                // findOrFail will throw an exception if the model is not found
                return Restaurant::findOrFail($id);
            });

            return response()->json($restaurant);

        } catch (ModelNotFoundException $e) {
            // Specifically catch the "not found" exception
            return response()->json([
                'error' => 'Restaurant not found.'
            ], 404);

        } catch (\Exception $e) {
            // Catch any other potential errors
            Log::error("Error fetching restaurant {$id}: " . $e->getMessage());

            return response()->json([
                'error' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }
}
