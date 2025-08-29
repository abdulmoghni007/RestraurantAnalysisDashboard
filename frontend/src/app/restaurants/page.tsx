'use client';

import { useState } from 'react';
import Link from 'next/link';
import { restaurantAPI } from '@/lib/api';
import { Restaurant } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce'; // We'll create this hook next

export default function RestaurantsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants', debouncedSearch, sortBy, sortOrder],
    queryFn: () => restaurantAPI.getAll({ search: debouncedSearch, sort_by: sortBy, sort_order: sortOrder }),
  });

  const restaurants: Restaurant[] = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurants</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search restaurants..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border rounded-lg">
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </select>
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Sort {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <Link key={r.id} href={`/restaurants/${r.id}`} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{r.name}</h2>
              <p className="text-gray-600 mb-2">{r.cuisine_type}</p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-500">★ {r.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}