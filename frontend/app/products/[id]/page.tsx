'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useProduct } from '@/lib/hooks';
import Navbar from '@/components/Navbar';
import { Variant } from '@/types';
import { formatNGN } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;

  const currentVariant = selectedVariant || (product?.variants?.[0] ?? null);
  const allImages = [
    ...(product?.images || []),
    ...(currentVariant?.images || []),
  ];
  const displayImage = selectedImage || allImages.find((i) => i.is_primary)?.image_url || allImages[0]?.image_url;

  const formatPrice = (price: string | number) => formatNGN(price);

  const maxQuantity = useMemo(() => {
    if (!currentVariant || currentVariant.stock <= 0) return null;
    return currentVariant.stock;
  }, [currentVariant]);

  useEffect(() => {
    if (maxQuantity && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity]);

  const variantLabel = (variant: Variant) => {
    const parts = [
      variant.color,
      variant.strap_type,
      variant.size ? `Size: ${variant.size}` : '',
      variant.sku ? `SKU: ${variant.sku}` : '',
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(' • ') : 'Standard';
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const variant = currentVariant;
    const price = variant ? variant.price : product.base_price;
    const variantDesc = variant ? variantLabel(variant) : 'Standard';

    const message = `Hello, I want to order:

Product: ${product.name}
Variant: ${variantDesc}
Price: ${formatPrice(price)}
Quantity: ${quantity}

Please confirm availability.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-32" aria-live="polite">
          <p className="text-red-500 text-xl">Product not found.</p>
          <Link href="/products" className="mt-4 inline-block text-yellow-600 hover:underline">← Back to Watches</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/products" className="text-yellow-600 hover:underline mb-6 inline-block focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 rounded-sm">← Back to Watches</Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="p-8 bg-gray-50">
              <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden mb-4">
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`relative flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                        displayImage === img.image_url ? 'border-yellow-400' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={img.image_url}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8">
              <div className="mb-2">
                <span className="text-sm text-gray-500 uppercase tracking-wide">{product.brand_detail?.name || 'Unknown Brand'}</span>
                {product.category_detail && (
                  <span className="ml-3 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category_detail.name}</span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              <div className="text-3xl font-extrabold text-yellow-600 mb-6">
                {formatPrice(currentVariant?.price || product.base_price)}
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Select Variant</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => { setSelectedVariant(variant); setSelectedImage(null); }}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          currentVariant?.id === variant.id
                            ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
                            : 'border-gray-200 text-gray-700 hover:border-yellow-300'
                        } ${variant.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                        disabled={variant.stock === 0}
                      >
                        {variantLabel(variant)}
                        {variant.stock === 0 && ' (Out of stock)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              {currentVariant && (
                <div className="mb-6">
                  <span className={`text-sm font-medium ${currentVariant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentVariant.stock > 0 ? `✓ ${currentVariant.stock} in stock` : '✗ Out of stock'}
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={currentVariant?.stock === 0}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-lg font-bold hover:border-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => (maxQuantity ? Math.min(maxQuantity, q + 1) : q + 1))}
                    disabled={currentVariant?.stock === 0}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-lg font-bold hover:border-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  {maxQuantity && (
                    <span className="text-sm text-gray-500">Max {maxQuantity}</span>
                  )}
                </div>
              </div>

              {/* WhatsApp Order Button */}
              {whatsappLink ? (
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={currentVariant?.stock === 0}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full bg-gray-200 text-gray-500 py-4 px-8 rounded-xl font-bold text-lg cursor-not-allowed"
                >
                  WhatsApp Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
