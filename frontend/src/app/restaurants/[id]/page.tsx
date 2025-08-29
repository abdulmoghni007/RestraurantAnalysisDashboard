'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { analyticsAPI, restaurantAPI } from '@/lib/api';
import { Restaurant, AnalyticsData } from '@/types';
import TrendChart from '@/components/charts/TrendChart';
import DateRangePicker from '@/components/filters/DateRangePicker';
import { useQuery } from '@tanstack/react-query';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export default function RestaurantDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const today = new Date();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [dateRange, setDateRange] = useState({
    start_date: formatDate(sevenDaysAgo),
    end_date: formatDate(today),
  });

  const { data: restaurant, isLoading: isRestaurantLoading } = useQuery<Restaurant>({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantAPI.getById(id),
    enabled: !!id,
  });

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', id, dateRange],
    queryFn: () => analyticsAPI.getOrderTrends(id, dateRange),
    enabled: !!id,
  });

  if (isRestaurantLoading || isAnalyticsLoading) return <div className="text-center py-8">Loading...</div>;
  if (!restaurant || !analytics) return <div className="text-center py-8">Data not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-gray-600 mt-2">{restaurant.cuisine_type} • {restaurant.location} • ★ {restaurant.rating}</p>
        </div>
        <DateRangePicker
          startDate={dateRange.start_date}
          endDate={dateRange.end_date}
          onChange={(start, end) => setDateRange({ start_date: start, end_date: end })}
          maxDate={formatDate(today)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={analytics.daily_stats} metric="order_count" title="Daily Orders" color="#3B82F6" />
        <TrendChart data={analytics.daily_stats} metric="revenue" title="Daily Revenue" color="#10B981" />
        <TrendChart data={analytics.daily_stats} metric="avg_order_value" title="Average Order Value" color="#F59E0B" />
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Peak Order Hours</h3>
            <div className="space-y-2">
              {analytics.peak_hours.map((peak) => (
                <div key={peak.hour} className="flex justify-between items-center">
                  <span className="text-gray-600">{peak.hour}:00 - {peak.hour + 1}:00</span>
                  <span className="font-semibold">{peak.order_count} orders</span>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}