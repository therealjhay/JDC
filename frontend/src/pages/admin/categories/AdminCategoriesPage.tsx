import { useEffect, useMemo, useState } from 'react';
import { useCategories } from '@/lib/hooks';
import { useCreateCategory, useDeleteCategory } from '@/lib/adminHooks';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDebouncedValue } from '@/lib/useDebouncedValue';

export default function AdminCategoriesPage() {
  useRequireAdmin();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);
  const PAGE_SIZE = 20;
  const { data, isLoading, refetch } = useCategories({
    page: String(page),
    page_size: String(PAGE_SIZE),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

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
      await createCategory.mutateAsync({ name });
      setName('');
      refetch();
    } catch {
      setError('Failed to create category.');
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"?`)) return;
    await deleteCategory.mutateAsync(id);
    refetch();
  };

  return (
    <AdminLayout title="Categories" backHref="/admin" backLabel="← Dashboard">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-primary-900 mb-4">Add Category</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Luxury"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
            <button
              type="submit"
              disabled={createCategory.isPending}
              className="bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              {createCategory.isPending ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search categories..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {data?.count ?? 0} {(data?.count ?? 0) === 1 ? 'category' : 'categories'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500"></div>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No categories yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Name</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Slug</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data?.results.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 text-primary-900 font-medium text-xs sm:text-sm">{category.name}</td>
                      <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm">{category.slug}</td>
                      <td className="px-4 sm:px-6 py-3 text-right">
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm"
            >
              First
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data?.previous}
              className="px-4 py-2 bg-primary-900 text-white rounded-lg disabled:opacity-40 hover:bg-primary-700 transition-colors text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.next}
              className="px-4 py-2 bg-primary-900 text-white rounded-lg disabled:opacity-40 hover:bg-primary-700 transition-colors text-sm"
            >
              Next
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
