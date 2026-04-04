'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCategories, useBrands } from '@/lib/hooks';
import { useCreateProduct } from '@/lib/adminHooks';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  const router = useRouter();
  useRequireAdmin();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const createProduct = useCreateProduct();

  const [form, setForm] = useState({
    name: '',
    description: '',
    base_price: '',
    brand: '',
    category: '',
    is_active: true,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        description: form.description,
        base_price: form.base_price,
        is_active: form.is_active,
      };
      if (form.brand) payload.brand = form.brand;
      if (form.category) payload.category = form.category;

      const product = await createProduct.mutateAsync(payload);
      router.push(`/admin/products/${product.id}/edit`);
    } catch {
      setError('Failed to create product. Please check your inputs.');
    }
  };

  return (
    <AdminLayout title="Add New Product" backHref="/admin/products" backLabel="← Products">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. Rolex Submariner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Describe the product..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (NGN) *</label>
              <input
                type="number"
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. 150000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">— Select Brand —</option>
                {brands?.results.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">— Select Category —</option>
                {categories?.results.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded accent-yellow-400"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (visible in store)</label>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={createProduct.isPending}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 font-bold py-3 rounded-lg transition-colors"
              >
                {createProduct.isPending ? 'Creating...' : 'Create Product'}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
