'use client';

import { useState } from 'react';
import Link from 'next/link';
import { analyticsAPI } from '@/lib/api';
import { Restaurant } from '@/types';
import DateRangePicker from '@/components/filters/DateRangePicker';
import { useQuery } from '@tanstack/react-query';

// Helper to format dates
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export default function DashboardPage() {
  const today = new Date();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [dateRange, setDateRange] = useState({
    start_date: formatDate(sevenDaysAgo),
    end_date: formatDate(today),
  });

  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['overview', dateRange],
    queryFn: () => analyticsAPI.getOverview(dateRange),
  });

  const { data: topRestaurants, isLoading: isTopRestaurantsLoading } = useQuery<Restaurant[]>({
    queryKey: ['topRestaurants', dateRange],
    queryFn: () => analyticsAPI.getTopRestaurants(dateRange),
  });

  const isLoading = isOverviewLoading || isTopRestaurantsLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <DateRangePicker
          startDate={dateRange.start_date}
          endDate={dateRange.end_date}
          onChange={(start, end) => setDateRange({ start_date: start, end_date: end })}
          maxDate={formatDate(today)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.total_orders || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Revenue</p>
              {/* FIX: Convert string to number before calling toFixed */}
              <p className="text-2xl font-bold text-gray-900">
                ${overview?.total_revenue ? Number(overview.total_revenue).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600">Avg Order Value</p>
              {/* FIX: Convert string to number before calling toFixed */}
              <p className="text-2xl font-bold text-gray-900">
                ${overview?.avg_order_value ? Number(overview.avg_order_value).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600">Active Restaurants</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.active_restaurants || 0}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Top 3 Restaurants by Revenue</h2>
            <div className="space-y-4">
              {topRestaurants?.length ? topRestaurants.map((restaurant, index) => (
                <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                    <div>
                      <p className="font-semibold">{restaurant.name}</p>
                      <p className="text-sm text-gray-600">{restaurant.cuisine_type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(restaurant.total_revenue).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{restaurant.total_orders} orders</p>
                  </div>
                </Link>
              )) : <p>No restaurant data available for this period.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
