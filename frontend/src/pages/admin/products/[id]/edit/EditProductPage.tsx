import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct, useCategories, useBrands } from '@/lib/hooks';
import { useUpdateProduct, useCreateVariant, useDeleteVariant, useUploadImage, useDeleteImage } from '@/lib/adminHooks';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditProductPage() {
  useRequireAdmin();
  const { id } = useParams();
  const productId = id ?? '';
  const { data: product, isLoading, refetch } = useProduct(productId);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const updateProduct = useUpdateProduct(productId);
  const createVariant = useCreateVariant();
  const deleteVariant = useDeleteVariant();
  const uploadImage = useUploadImage();
  const deleteImage = useDeleteImage();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: '', description: '', base_price: '', brand: '', category: '', is_active: true });
  const [variantForm, setVariantForm] = useState({ color: '', strap_type: '', size: '', price: '', stock: '0', sku: '' });
  const [saveStatus, setSaveStatus] = useState('');
  const [variantError, setVariantError] = useState('');
  const [imageError, setImageError] = useState('');
  const [imageVariant, setImageVariant] = useState('');
  const [imagePrimary, setImagePrimary] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        base_price: product.base_price,
        brand: product.brand || '',
        category: product.category || '',
        is_active: product.is_active,
      });
    }
  }, [product]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        description: form.description,
        base_price: form.base_price,
        is_active: form.is_active,
      };
      if (form.brand) payload.brand = form.brand;
      if (form.category) payload.category = form.category;
      await updateProduct.mutateAsync(payload);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setVariantError('');
    try {
      await createVariant.mutateAsync({ ...variantForm, product: productId, price: Number(variantForm.price), stock: Number(variantForm.stock) });
      setVariantForm({ color: '', strap_type: '', size: '', price: '', stock: '0', sku: '' });
      refetch();
    } catch {
      setVariantError('Failed to add variant.');
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Delete this variant?')) return;
    await deleteVariant.mutateAsync(variantId);
    refetch();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageError('');
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('product', productId);
    if (imageVariant) formData.append('variant', imageVariant);
    if (imagePrimary) formData.append('primary_index', '0');
    try {
      await uploadImage.mutateAsync(formData);
      refetch();
    } catch {
      setImageError('Failed to upload image.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;
    await deleteImage.mutateAsync(imageId);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-sm sm:text-base">Product not found.</p>
      </div>
    );
  }

  return (
    <AdminLayout title={`Edit: ${product.name}`} backHref="/admin/products" backLabel="← Products">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-primary-900 mb-4 sm:mb-6">Product Details</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (NGN) *</label>
                <input
                  type="number"
                  value={form.base_price}
                  onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                >
                  <option value="">— None —</option>
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                >
                  <option value="">— None —</option>
                  {categories?.results.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 accent-accent-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <button
              type="submit"
              disabled={updateProduct.isPending}
              className="bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved!' : saveStatus === 'error' ? 'Error!' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-primary-900 mb-4 sm:mb-6">Images</h2>
          {imageError && <p className="text-red-500 text-sm mb-4">{imageError}</p>}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
            {product.images?.map((img) => (
              <div key={img.id} className="relative group">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={img.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                {img.is_primary && (
                  <span className="absolute top-1 left-1 bg-primary-900 text-white text-xs px-1.5 py-0.5 rounded">Primary</span>
                )}
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100"
            />
            {uploadImage.isPending && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Attach To Variant (optional)</label>
              <select
                value={imageVariant}
                onChange={(e) => setImageVariant(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              >
                <option value="">— Product Gallery —</option>
                {product.variants?.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.color || variant.strap_type || variant.size || variant.sku || 'Variant'}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <input
                type="checkbox"
                id="image_primary"
                checked={imagePrimary}
                onChange={(e) => setImagePrimary(e.target.checked)}
                className="w-4 h-4 accent-accent-500"
              />
              <label htmlFor="image_primary" className="text-sm font-medium text-gray-700">Set first image as primary</label>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 border border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-primary-900 mb-4 sm:mb-6">Variants</h2>

          {/* Existing variants */}
          {product.variants?.length > 0 && (
            <div className="overflow-x-auto mb-6 sm:mb-8">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 font-medium text-xs sm:text-sm">Color</th>
                    <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 font-medium text-xs sm:text-sm">Strap</th>
                    <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 font-medium text-xs sm:text-sm">Size</th>
                    <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 font-medium text-xs sm:text-sm">Price</th>
                    <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 font-medium text-xs sm:text-sm">Stock</th>
                    <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 font-medium text-xs sm:text-sm">SKU</th>
                    <th className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 font-medium text-xs sm:text-sm"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {product.variants.map((v) => (
                    <tr key={v.id}>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 text-xs sm:text-sm">{v.color || '—'}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 text-xs sm:text-sm">{v.strap_type || '—'}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 text-xs sm:text-sm">{v.size || '—'}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 text-xs sm:text-sm">{v.price}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 text-xs sm:text-sm">{v.stock}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 text-xs sm:text-sm">{v.sku}</td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <button
                          onClick={() => handleDeleteVariant(v.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
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

          {/* Add Variant Form */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Add Variant</h3>
          {variantError && <p className="text-red-500 text-sm mb-4">{variantError}</p>}
          <form onSubmit={handleAddVariant} className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Color</label>
              <input
                type="text"
                value={variantForm.color}
                onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="e.g. Black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Strap Type</label>
              <input
                type="text"
                value={variantForm.strap_type}
                onChange={(e) => setVariantForm({ ...variantForm, strap_type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="e.g. Leather"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Size</label>
              <input
                type="text"
                value={variantForm.size}
                onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="e.g. 42mm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Price (NGN) *</label>
              <input
                type="number"
                value={variantForm.price}
                onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Stock</label>
              <input
                type="number"
                value={variantForm.stock}
                onChange={(e) => setVariantForm({ ...variantForm, stock: e.target.value })}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">SKU</label>
              <input
                type="text"
                value={variantForm.sku}
                onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            <div className="col-span-2 md:col-span-3">
              <button
                type="submit"
                disabled={createVariant.isPending}
                className="bg-primary-900 hover:bg-primary-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                {createVariant.isPending ? 'Adding...' : '+ Add Variant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
