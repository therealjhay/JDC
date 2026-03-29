'use client';

import { useState } from 'react';
import { useProducts, useCategories, useBrands } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [ordering, setOrdering] = useState('');
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page) };
  if (search) params.search = search;
  if (brand) params.brand = brand;
  if (category) params.category = category;
  if (ordering) params.ordering = ordering;

  const { data, isLoading, error } = useProducts(params);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Watch Collection</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search watches..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <select
              value={brand}
              onChange={(e) => { setBrand(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">All Brands</option>
              {brands?.results.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">All Categories</option>
              {categories?.results.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={ordering}
              onChange={(e) => { setOrdering(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Sort by</option>
              <option value="base_price">Price: Low to High</option>
              <option value="-base_price">Price: High to Low</option>
              <option value="-created_at">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">Failed to load products. Please try again.</p>
          </div>
        ) : data?.results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No watches found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data?.previous}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-600">
                {data?.count} watches found
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.next}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
