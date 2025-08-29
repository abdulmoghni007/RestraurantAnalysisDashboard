<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $restaurantsJson = file_get_contents(storage_path('data/restaurants.json'));
        $ordersJson = file_get_contents(storage_path('data/orders.json'));

        $restaurantsData = json_decode($restaurantsJson, true);
        $ordersData = json_decode($ordersJson, true);

        foreach ($restaurantsData as $restaurantData) {
            Restaurant::create($restaurantData);
        }

        foreach ($ordersData as $orderData) {
            $order = Order::create([
                'id' => $orderData['id'],
                'restaurant_id' => $orderData['restaurant_id'],
                'customer_name' => $orderData['customer_name'],
                'total_amount' => $orderData['total_amount'],
                'status' => $orderData['status'],
                'order_datetime' => Carbon::parse($orderData['order_datetime'])
            ]);

            foreach ($orderData['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_name' => $item['item_name'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }
        }
    }
}
