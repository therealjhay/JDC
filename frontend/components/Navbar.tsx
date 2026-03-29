'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-yellow-400">
            JDC Watches
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-yellow-400 transition-colors">Watches</Link>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block hover:text-yellow-400 transition-colors">Home</Link>
            <Link href="/products" className="block hover:text-yellow-400 transition-colors">Watches</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
