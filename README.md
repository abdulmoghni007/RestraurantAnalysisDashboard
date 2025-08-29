# 🍽️ Restaurant Analytics Dashboard

A full-stack web application designed to provide restaurant owners and managers with a powerful tool to analyze order data, track performance metrics, and gain insights into their business operations. 

This dashboard features a **Laravel API backend** for robust data processing and a **modern Next.js frontend** for a fast, interactive user experience.

---

## 🛠 Tech Stack

The project is built with a modern, scalable, and efficient technology stack.

### Backend
- Laravel 10
- MySQL
- Redis

### Frontend
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- TanStack React Query

---

## 📊 Application Preview

### Main Dashboard
The main dashboard provides a high-level overview of all key metrics. Users can filter the entire view by a specific date range.

### Detailed Analytics
Each restaurant has a dedicated page showing detailed trends for orders, revenue, and peak hours, helping managers make informed decisions.

---

## ✨ Key Features

- **At-a-Glance Dashboard:** A central hub displaying key performance indicators (KPIs).
- **Dynamic Date Range Filtering:** All analytics can be filtered by a custom date range.
- **Top Restaurants Analysis:** A dynamically updated list of the top-performing restaurants.
- **Detailed Restaurant Analytics:** A dedicated page for each restaurant showing trends and charts.
- **Peak Hour Analysis:** Identifies the busiest hours of the day to help with staffing.
- **Search & Sort Functionality:** Easily search and sort through a list of all restaurants.
- **Optimized Performance:** Backend caching with Redis and frontend caching with React Query ensure a fast and responsive user experience.

---

## 📁 Project Structure

The project is organized into two main directories: `backend` for the Laravel API and `frontend` for the Next.js application.

### Backend (Laravel)
backend/
├── app/
│ ├── Http/Controllers/Api/
│ ├── Models/
│ └── Providers/
├── database/
│ ├── migrations/
│ └── seeders/
├── routes/
│ └── api.php
└── storage/data/


### Frontend (Next.js)


frontend/
└── src/
├── app/
│ ├── restaurants/
│ │ ├── [id]/
│ │ │ └── page.tsx
│ │ └── page.tsx
│ └── page.tsx
├── components/
│ ├── charts/
│ ├── filters/
│ └── layout/
├── hooks/
├── lib/
└── types/



---

## 🧠 How It Works: Architecture Explained

### Backend: Caching with Redis
To prevent slow, repetitive database queries, the Laravel backend uses Redis for caching. Expensive queries are wrapped in a `Cache::remember()` block:

🔧 Backend Setup (Laravel)

Install Dependencies:

cd backend
composer install


Configure Environment:

cp .env.example .env
php artisan key:generate


Database Setup:

Create a MySQL database named restaurant_analytics

Update .env with your DB credentials

Migrate & Seed Database:

php artisan migrate:fresh --seed


Run Server:

php artisan serve

💻 Frontend Setup (Next.js)

Install Dependencies:

cd frontend
npm install


Configure Environment:

cp .env.local.example .env.local


Ensure NEXT_PUBLIC_API_URL is set to:

http://127.0.0.1:8000/api


Run Server:

npm run dev

📬 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📄 License

MIT

🧠 Author

Abdul Moghni — Full-stack Developer

Feel free to reach out on LinkedIn
 or GitHub


Let me know if you want this customized with your name, repo links, or a logo at the top!


