import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/products/ProductsPage';
import ProductDetailPage from '@/pages/products/ProductDetailPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminLoginPage from '@/pages/admin/login/AdminLoginPage';
import AdminProductsPage from '@/pages/admin/products/AdminProductsPage';
import NewProductPage from '@/pages/admin/products/NewProductPage';
import EditProductPage from '@/pages/admin/products/[id]/edit/EditProductPage';
import AdminCategoriesPage from '@/pages/admin/categories/AdminCategoriesPage';
import AdminBrandsPage from '@/pages/admin/brands/AdminBrandsPage';
import AdminOrdersPage from '@/pages/admin/orders/AdminOrdersPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/products/new" element={<NewProductPage />} />
      <Route path="/admin/products/:id/edit" element={<EditProductPage />} />
      <Route path="/admin/categories" element={<AdminCategoriesPage />} />
      <Route path="/admin/brands" element={<AdminBrandsPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
