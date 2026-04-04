'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts, useCategories, useBrands } from '@/lib/hooks';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { useDebouncedValue } from '@/lib/useDebouncedValue';

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [brand, setBrand] = useState(() => searchParams.get('brand') || '');
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [ordering, setOrdering] = useState(() => searchParams.get('ordering') || '');
  const [page, setPage] = useState(() => Number(searchParams.get('page') || 1));
  const debouncedSearch = useDebouncedValue(search, 350);

  const PAGE_SIZE = 12;

  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (isSyncingRef.current) {
      isSyncingRef.current = false;
      return;
    }
    setSearch(searchParams.get('search') || '');
    setBrand(searchParams.get('brand') || '');
    setCategory(searchParams.get('category') || '');
    setOrdering(searchParams.get('ordering') || '');
    setPage(Number(searchParams.get('page') || 1));
  }, [searchParams]);

  const params: Record<string, string> = { page: String(page), page_size: String(PAGE_SIZE) };
  if (debouncedSearch) params.search = debouncedSearch;
  if (brand) params.brand = brand;
  if (category) params.category = category;
  if (ordering) params.ordering = ordering;

  const { data, isLoading, error } = useProducts(params);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (debouncedSearch) nextParams.set('search', debouncedSearch);
    if (brand) nextParams.set('brand', brand);
    if (category) nextParams.set('category', category);
    if (ordering) nextParams.set('ordering', ordering);
    if (page > 1) nextParams.set('page', String(page));
    const qs = nextParams.toString();
    isSyncingRef.current = true;
    router.replace(qs ? `/products?${qs}` : '/products');
  }, [debouncedSearch, brand, category, ordering, page, router]);

  const totalPages = useMemo(() => {
    if (!data?.count) return 1;
    return Math.max(1, Math.ceil(data.count / PAGE_SIZE));
  }, [data?.count]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    const numbers = [];
    for (let i = start; i <= end; i += 1) numbers.push(i);
    return numbers;
  }, [page, totalPages]);

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
          <div className="text-center py-20" aria-live="polite">
            <p className="text-red-500 text-lg">Failed to load products. Please try again.</p>
          </div>
        ) : data?.results.length === 0 ? (
          <div className="text-center py-20" aria-live="polite">
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
            <div className="flex flex-col items-center gap-4 mt-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  First
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data?.previous}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {pageNumbers.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        p === page ? 'bg-yellow-400 text-gray-900' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data?.next}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Last
                </button>
              </div>
              <span className="text-gray-600">
                {data?.count} watches found • Page {page} of {totalPages}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
