'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBrands } from '@/lib/hooks';
import { useCreateBrand, useDeleteBrand } from '@/lib/adminHooks';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDebouncedValue } from '@/lib/useDebouncedValue';

export const dynamic = 'force-dynamic';

export default function AdminBrandsPage() {
  useRequireAdmin();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);
  const PAGE_SIZE = 20;
  const { data, isLoading, refetch } = useBrands({
    page: String(page),
    page_size: String(PAGE_SIZE),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });
  const createBrand = useCreateBrand();
  const deleteBrand = useDeleteBrand();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const totalPages = useMemo(() => {
    if (!data?.count) return 1;
    return Math.max(1, Math.ceil(data.count / PAGE_SIZE));
  }, [data?.count]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createBrand.mutateAsync({ name });
      setName('');
      refetch();
    } catch {
      setError('Failed to create brand.');
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"?`)) return;
    await deleteBrand.mutateAsync(id);
    refetch();
  };

  return (
    <AdminLayout title="Brands" backHref="/admin" backLabel="← Dashboard">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add Brand</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Casio"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={createBrand.isPending}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 font-bold px-4 py-2 rounded-lg transition-colors"
            >
              {createBrand.isPending ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search brands..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="text-sm text-gray-500">
              {data?.count ?? 0} brand{(data?.count ?? 0) === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No brands yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Name</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Slug</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.results.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{brand.name}</td>
                    <td className="px-6 py-4 text-gray-600">{brand.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(brand.id, brand.name)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
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
        </div>
      </div>
    </AdminLayout>
  );
}
