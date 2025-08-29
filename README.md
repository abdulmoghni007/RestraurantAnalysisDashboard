Restaurant Analytics Dashboard
A full-stack web application designed to provide restaurant owners and managers with a powerful tool to analyze order data, track performance metrics, and gain insights into their business operations. This dashboard features a Laravel API backend for robust data processing and a modern Next.js frontend for a fast, interactive user experience.

Tech Stack
The project is built with a modern, scalable, and efficient technology stack.

Backend:

Frontend:

Application Preview
Main Dashboard
The main dashboard provides a high-level overview of all key metrics. Users can filter the entire view by a specific date range.

**

Detailed Analytics
Each restaurant has a dedicated page showing detailed trends for orders, revenue, and peak hours, helping managers make informed decisions.

**

Key Features
At-a-Glance Dashboard: A central hub displaying key performance indicators (KPIs).

Dynamic Date Range Filtering: All analytics can be filtered by a custom date range.

Top Restaurants Analysis: A dynamically updated list of the top-performing restaurants.

Detailed Restaurant Analytics: A dedicated page for each restaurant showing trends and charts.

Peak Hour Analysis: Identifies the busiest hours of the day to help with staffing.

Search & Sort Functionality: Easily search and sort through a list of all restaurants.

Optimized Performance: Backend caching with Redis and frontend caching with React Query ensure a fast and responsive user experience.

Project Structure
The project is organized into two main directories: backend for the Laravel API and frontend for the Next.js application.

Backend (Laravel)
backend/
├── app/
│   ├── Http/Controllers/Api/
│   ├── Models/
│   └── Providers/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── storage/data/

Frontend (Next.js)
frontend/
└── src/
    ├── app/
    │   ├── restaurants/
    │   │   ├── [id]/
    │   │   │   └── page.tsx
    │   │   └── page.tsx
    │   └── page.tsx
    ├── components/
    │   ├── charts/
    │   ├── filters/
    │   └── layout/
    ├── hooks/
    ├── lib/
    └── types/

How It Works: Architecture Explained
Backend: Caching with Redis
To prevent slow, repetitive database queries, the Laravel backend uses Redis for caching. Expensive queries are wrapped in a Cache::remember() block.

return Cache::remember($cacheKey, 1800, function() {
    // This complex database query only runs if the result
    // is not already in the cache.
    return Restaurant::query()->...->get();
});

This means the first time data is requested, the result is stored in Redis for 30 minutes. Subsequent requests are served instantly from the cache, making the API extremely fast.

Frontend: State Management with React Query
The frontend uses TanStack React Query to manage all interactions with the backend API.

const { data, isLoading } = useQuery({
  queryKey: ['overview', dateRange],
  queryFn: () => analyticsAPI.getOverview(dateRange),
});

useQuery automatically handles loading states, caching, and automatic refetching when data dependencies (like the dateRange) change, making the application more resilient and performant.

Project Setup and Installation
Follow these steps to get the project running on your local machine. You will need two separate terminal windows for the backend and frontend.

Prerequisites
PHP 8.1+ & Composer

Node.js 18+ & npm

MySQL Server

Redis Server

Backend Setup (Laravel)
Install Dependencies:

cd backend
composer install

Configure Environment:

cp .env.example .env
php artisan key:generate

Database Setup:

Create a MySQL database named restaurant_analytics.

Update the .env file with your database credentials.

Migrate & Seed Database:

php artisan migrate:fresh --seed

Run Server:

php artisan serve

Frontend Setup (Next.js)
Install Dependencies:

cd frontend
npm install

Configure Environment:

cp .env.local.example .env.local

(Ensure NEXT_PUBLIC_API_URL points to your backend: http://127.0.0.1:8000/api)

Run Server:

npm run dev

The application will be available at http://localhost:3000.
