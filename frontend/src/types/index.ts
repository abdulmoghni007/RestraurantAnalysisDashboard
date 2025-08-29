export interface Restaurant {
  id: number;
  name: string;
  cuisine_type: string;
  rating: number;
  location: string;
  is_active: boolean;
  total_revenue?: number;
  total_orders?: number;
}

export interface DailyStat {
  date: string;
  order_count: number;
  revenue: number;
  avg_order_value: number;
}

export interface PeakHour {
  hour: number;
  order_count: number;
}

export interface AnalyticsData {
  daily_stats: DailyStat[];
  peak_hours: PeakHour[];
}
