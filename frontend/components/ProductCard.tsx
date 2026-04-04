import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatNGN } from '@/lib/format';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const formattedPrice = formatNGN(product.base_price);

  return (
    <Link href={`/products/${product.id}`} className="group focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 rounded-xl">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
        <div className="relative h-64 bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-gray-900/90 text-white text-xs font-semibold px-3 py-2 rounded-full">
              Quick view →
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand_detail?.name || 'Unknown Brand'}</p>
          <h3 className="mt-1 text-gray-900 font-semibold text-lg line-clamp-2 group-hover:text-yellow-600 transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-amber-700 font-bold text-xl">
            From {formattedPrice}
          </p>
          <div className="mt-2">
            {product.variants && product.variants.length > 0 ? (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
              </span>
            ) : (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                No variants
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
