'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCategories } from '@/lib/hooks';
import { useCreateCategory, useDeleteCategory } from '@/lib/adminHooks';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
      router.push('/admin/login');
    }
  }, [router]);

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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-300 hover:text-white text-sm">← Dashboard</Link>
        <h1 className="text-xl font-bold text-yellow-400">Categories</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add Category</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Luxury"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={createCategory.isPending}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 font-bold px-4 py-2 rounded-lg transition-colors"
            >
              {createCategory.isPending ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No categories yet.</div>
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
                {data?.results.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-gray-600">{category.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
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
      </div>
    </div>
  );
}
