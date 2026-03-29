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

export function useCategories() {
  return useQuery<PaginatedResponse<Category>>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/api/categories/');
      return res.data;
    },
  });
}

export function useBrands() {
  return useQuery<PaginatedResponse<Brand>>({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await api.get('/api/brands/');
      return res.data;
    },
  });
}

export function useOrders() {
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get('/api/orders/');
      return res.data;
    },
  });
}
