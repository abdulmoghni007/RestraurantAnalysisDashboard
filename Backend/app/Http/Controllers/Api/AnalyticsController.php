<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AnalyticsController extends Controller
{

    /**
     * Validates and parses the date range from the request.
     * Throws ValidationException on failure.
     */
    private function getDates(Request $request): array
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        return [
            Carbon::parse($request->start_date)->startOfDay(),
            Carbon::parse($request->end_date)->endOfDay()
        ];
    }

    public function overview(Request $request)
    {
        try {
            [$startDate, $endDate] = $this->getDates($request);
            $cacheKey = "overview_{$startDate->toDateString()}_{$endDate->toDateString()}";

            return Cache::remember($cacheKey, 600, function() use ($startDate, $endDate) {
                $query = Order::completed()->withinDateRange($startDate, $endDate);

                return response()->json([
                    'total_orders' => (clone $query)->count(),
                    'total_revenue' => (clone $query)->sum('total_amount'),
                    'avg_order_value' => (clone $query)->avg('total_amount'),
                    'active_restaurants' => Restaurant::where('is_active', true)->count()
                ]);
            });
        } catch (ValidationException $e) {
            // Return a structured validation error response
            return response()->json(['error' => 'Invalid date range provided.', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Overview Analytics Error: ' . $e->getMessage());
            return response()->json(['error' => 'Could not retrieve overview analytics.'], 500);
        }
    }

    public function topRestaurants(Request $request)
    {
        try {
            [$startDate, $endDate] = $this->getDates($request);
            $cacheKey = "top_restaurants_{$startDate->toDateString()}_{$endDate->toDateString()}";

            return Cache::remember($cacheKey, 1800, function() use ($startDate, $endDate) {
                $topRestaurants = Restaurant::select('restaurants.*')
                    ->selectRaw('SUM(orders.total_amount) as total_revenue, COUNT(orders.id) as total_orders')
                    ->join('orders', 'restaurants.id', '=', 'orders.restaurant_id')
                    ->where('orders.status', 'completed')
                    ->whereBetween('orders.order_datetime', [$startDate, $endDate])
                    ->groupBy('restaurants.id', 'restaurants.name', 'restaurants.cuisine_type', 'restaurants.rating', 'restaurants.location', 'restaurants.is_active', 'restaurants.created_at', 'restaurants.updated_at')
                    ->orderBy('total_revenue', 'desc')
                    ->limit(3)
                    ->get();

                return response()->json($topRestaurants);
            });
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Invalid date range provided.', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Top Restaurants Analytics Error: ' . $e->getMessage());
            return response()->json(['error' => 'Could not retrieve top restaurants.'], 500);
        }
    }

    public function orderTrends(Request $request, $restaurantId)
    {
        try {
            // First, check if the restaurant exists to provide a clear 404 error
            Restaurant::findOrFail($restaurantId);

            [$startDate, $endDate] = $this->getDates($request);
            $cacheKey = "trends_{$restaurantId}_{$startDate->toDateString()}_{$endDate->toDateString()}";

            return Cache::remember($cacheKey, 1800, function() use ($restaurantId, $startDate, $endDate) {
                $baseQuery = Order::completed()
                    ->where('restaurant_id', $restaurantId)
                    ->withinDateRange($startDate, $endDate);

                $dailyStats = (clone $baseQuery)
                    ->select(
                        DB::raw('DATE(order_datetime) as date'),
                        DB::raw('COUNT(*) as order_count'),
                        DB::raw('SUM(total_amount) as revenue'),
                        DB::raw('AVG(total_amount) as avg_order_value')
                    )
                    ->groupBy('date')->orderBy('date')->get();

                $peakHours = (clone $baseQuery)
                    ->select(DB::raw('HOUR(order_datetime) as hour'), DB::raw('COUNT(*) as order_count'))
                    ->groupBy('hour')->orderBy('order_count', 'desc')->get();

                return response()->json([
                    'daily_stats' => $dailyStats,
                    'peak_hours' => $peakHours,
                ]);
            });
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Restaurant not found.'], 404);
        } catch (ValidationException $e) {
            return response()->json(['error' => 'Invalid date range provided.', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("Order Trends Analytics Error for Restaurant {$restaurantId}: " . $e->getMessage());
            return response()->json(['error' => 'Could not retrieve order trends.'], 500);
        }
    }
}
