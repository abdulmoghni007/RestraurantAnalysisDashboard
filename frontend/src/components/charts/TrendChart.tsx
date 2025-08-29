'use client';

import { DailyStat } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: DailyStat[];
  metric: keyof DailyStat;
  title: string;
  color: string;
}

export default function TrendChart({ data, metric, title, color }: TrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => typeof value === 'number' ? `$${value.toFixed(2)}` : value} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={metric} 
            name={title}
            stroke={color} 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}