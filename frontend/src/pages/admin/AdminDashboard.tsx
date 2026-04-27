import { Link, useNavigate } from 'react-router-dom';
import { useProducts, useOrders } from '@/lib/hooks';
import api from '@/lib/api';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  useRequireAdmin();
  const { data: products } = useProducts({ page_size: '1' });
  const { data: orders } = useOrders({ page_size: '5' });

  const handleLogout = async () => {
    try {
      await api.post('/api/logout/');
    } finally {
      localStorage.removeItem('auth_token');
      navigate('/admin/login');
    }
  };

  return (
    <AdminLayout
      title="JDC Admin Dashboard"
      actions={(
        <>
          <Link to="/" target="_blank" className="text-gray-300 hover:text-white text-sm">View Store →</Link>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-3 sm:px-4 py-2 rounded-lg text-sm transition-colors">
            Logout
          </button>
        </>
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">Total Products</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary-900 mt-1">{products?.count ?? '—'}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary-900 mt-1">{orders?.count ?? '—'}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl sm:text-3xl font-bold text-accent-600 mt-1">
              {orders?.results?.filter((o) => o.status === 'pending').length ?? '—'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-primary-900 mb-4">Products</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/admin/products" className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm text-center">
                Manage Products
              </Link>
              <Link to="/admin/products/new" className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors text-sm text-center font-medium">
                + Add Product
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-primary-900 mb-4">Catalog</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/admin/brands" className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm text-center">
                Brands
              </Link>
              <Link to="/admin/categories" className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm text-center">
                Categories
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-primary-900 mb-4">Orders</h2>
            <Link to="/admin/orders" className="bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm text-center block">
              View All Orders
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-primary-900 mb-4">Recent Orders</h2>
          {orders?.results.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-gray-600 font-medium text-xs sm:text-sm">Customer</th>
                    <th className="pb-3 text-gray-600 font-medium text-xs sm:text-sm">Phone</th>
                    <th className="pb-3 text-gray-600 font-medium text-xs sm:text-sm">Status</th>
                    <th className="pb-3 text-gray-600 font-medium text-xs sm:text-sm">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders?.results.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 font-medium text-primary-900 text-xs sm:text-sm">{order.customer_name}</td>
                      <td className="py-3 text-gray-600 text-xs sm:text-sm">{order.phone}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600 text-xs sm:text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
