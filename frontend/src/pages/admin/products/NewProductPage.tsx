import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories, useBrands } from '@/lib/hooks';
import { useCreateProduct, useUploadProductImage } from '@/lib/adminHooks';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import { AxiosError } from 'axios';

interface FieldErrors {
  name?: string[];
  description?: string[];
  base_price?: string[];
  brand?: string[];
  category?: string[];
  image?: string[];
  non_field_errors?: string[];
}

export default function NewProductPage() {
  const navigate = useNavigate();
  useRequireAdmin();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const createProduct = useCreateProduct();
  const uploadProductImage = useUploadProductImage();

  const [form, setForm] = useState({
    name: '',
    description: '',
    base_price: '',
    brand: '',
    category: '',
    is_active: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');

    const productData = {
      name: form.name,
      description: form.description,
      base_price: form.base_price,
      is_active: form.is_active,
      brand: form.brand || undefined,
      category: form.category || undefined,
    };

    try {
      const product = await createProduct.mutateAsync(productData);

      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        await uploadProductImage.mutateAsync({ formData: imageFormData, productId: product.id });
      }

      navigate(`/admin/products/${product.id}/edit`);
    } catch (err) {
      const axiosError = err as AxiosError<{ [key: string]: string[] }>;
      if (axiosError.response?.data) {
        const data = axiosError.response.data;
        if (Object.keys(data).length > 0) {
          setFieldErrors(data);
        } else {
          setGeneralError('Failed to create product. Please try again.');
        }
      } else {
        setGeneralError('Failed to create product. Please check your connection.');
      }
    }
  };

  return (
    <AdminLayout title="Add New Product" backHref="/admin/products" backLabel="← Products">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100">
          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="e.g. Rolex Submariner"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name.join(', ')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="Describe the product..."
              />
              {fieldErrors.description && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.description.join(', ')}</p>
              )}
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="e.g. 150000"
              />
              {fieldErrors.base_price && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.base_price.join(', ')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              >
                <option value="">— Select Brand —</option>
                {brands?.results.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              {fieldErrors.brand && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.brand.join(', ')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              >
                <option value="">— Select Category —</option>
                {categories?.results.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {fieldErrors.category && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.category.join(', ')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
              {selectedImage && (
                <p className="mt-2 text-sm text-gray-600">Selected: {selectedImage.name}</p>
              )}
              {fieldErrors.image && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.image.join(', ')}</p>
              )}
            </div>

            {fieldErrors.non_field_errors && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Please correct the following:</p>
                <ul className="list-disc list-inside text-sm">
                  {fieldErrors.non_field_errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded accent-accent-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (visible in store)</label>
            </div>

            <div className="flex gap-3 sm:gap-4 pt-2">
              <button
                type="submit"
                disabled={createProduct.isPending}
                className="flex-1 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors"
              >
                {createProduct.isPending ? 'Creating...' : 'Create Product'}
              </button>
              <Link
                to="/admin/products"
                className="flex-1 text-center border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
