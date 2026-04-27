import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/lib/hooks';
import { useDeleteProduct } from '@/lib/adminHooks';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { formatNGN } from '@/lib/format';

export default function AdminProductsPage() {
  useRequireAdmin();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  const PAGE_SIZE = 20;
  const { data, isLoading, refetch } = useProducts({
    page: String(page),
    page_size: String(PAGE_SIZE),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });
  const deleteProduct = useDeleteProduct();
  const totalPages = useMemo(() => {
    if (!data?.count) return 1;
    return Math.max(1, Math.ceil(data.count / PAGE_SIZE));
  }, [data?.count]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct.mutateAsync(id);
      refetch();
    } catch {
      alert('Failed to delete product.');
    }
  };

  return (
    <AdminLayout
      title="Manage Products"
      backHref="/admin"
      backLabel="← Dashboard"
      actions={(
        <Link to="/admin/products/new" className="bg-accent-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-accent-600 transition-colors">
          + Add Product
        </Link>
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {data?.count ?? 0} product{(data?.count ?? 0) === 1 ? '' : 's'}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500"></div>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No products yet. <Link to="/admin/products/new" className="text-accent-600 hover:underline">Add one →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Name</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Brand</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Price</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Variants</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Status</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data?.results.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 font-medium text-primary-900 text-xs sm:text-sm">{product.name}</td>
                      <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm">{product.brand_detail?.name || '—'}</td>
                      <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm">
                        {formatNGN(product.base_price)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm">{product.variants?.length ?? 0}</td>
                      <td className="px-4 sm:px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex gap-3">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="text-accent-600 hover:text-accent-800 font-medium text-xs sm:text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
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
