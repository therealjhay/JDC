import { useQuery } from '@tanstack/react-query';
import api from './api';
import { Product, PaginatedResponse, Category, Brand, Order } from '@/types';

export function useProducts(params?: Record<string, string>) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await api.get('/api/products/', { params });
      return res.data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/api/products/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCategories(params?: Record<string, string>) {
  return useQuery<PaginatedResponse<Category>>({
    queryKey: ['categories', params],
    queryFn: async () => {
      const res = await api.get('/api/categories/', { params });
      return res.data;
    },
  });
}

export function useBrands(params?: Record<string, string>) {
  return useQuery<PaginatedResponse<Brand>>({
    queryKey: ['brands', params],
    queryFn: async () => {
      const res = await api.get('/api/brands/', { params });
      return res.data;
    },
  });
}

export function useOrders(params?: Record<string, string>) {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['orders', params],
    queryFn: async () => {
      const res = await api.get('/api/orders/', { params });
      return res.data;
    },
  });
}
