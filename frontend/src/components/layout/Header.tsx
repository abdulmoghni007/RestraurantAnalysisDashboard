import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Restaurant Analytics
            </Link>
            <nav className="ml-10 hidden md:flex space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/restaurants" className="text-gray-600 hover:text-gray-900">
                Restaurants
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}