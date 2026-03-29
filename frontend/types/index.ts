export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  image_url: string;
  public_id: string;
  is_primary: boolean;
  variant?: string;
}

export interface Variant {
  id: string;
  color: string;
  strap_type: string;
  size: string;
  price: string;
  stock: number;
  sku: string;
  images: ProductImage[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: Brand | null;
  category: Category | null;
  base_price: string;
  is_active: boolean;
  images: ProductImage[];
  variants: Variant[];
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  status: string;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  product: string;
  variant: string;
  quantity: number;
  price: string;
}
