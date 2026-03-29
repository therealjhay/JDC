'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '@/lib/hooks';
import { useDeleteProduct } from '@/lib/adminHooks';

export default function AdminProductsPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useProducts({ page_size: '100' });
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
      router.push('/admin/login');
    }
  }, [router]);

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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-300 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="text-xl font-bold text-yellow-400">Manage Products</h1>
        </div>
        <Link href="/admin/products/new" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-yellow-300 transition-colors">
          + Add Product
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No products yet. <Link href="/admin/products/new" className="text-yellow-600 hover:underline">Add one →</Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Name</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Brand</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Price</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Variants</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.results.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600">{product.brand?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(Number(product.base_price))}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.variants?.length ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
