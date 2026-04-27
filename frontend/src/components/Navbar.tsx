import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-accent-400 tracking-tight">
            JDC Watches
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</Link>
            <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Watches</Link>
          </div>
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-primary-800 pt-4">
            <Link to="/" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2">Home</Link>
            <Link to="/products" className="block text-gray-300 hover:text-white transition-colors text-sm font-medium py-2">Watches</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
