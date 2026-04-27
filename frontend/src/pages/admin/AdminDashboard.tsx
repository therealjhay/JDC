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
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm transition-colors">
            Logout
          </button>
        </>
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold text-navy-900">{products?.count ?? '—'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold text-navy-900">{orders?.count ?? '—'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-3xl font-bold text-navy-600">
              {orders?.results?.filter((o) => o.status === 'pending').length ?? '—'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Products</h2>
            <div className="flex gap-4">
              <Link to="/admin/products" className="bg-navy-900 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors text-sm">
                Manage Products
              </Link>
              <Link to="/admin/products/new" className="bg-navy-600 text-white px-4 py-2 rounded-lg hover:bg-navy-500 transition-colors text-sm font-medium">
                + Add Product
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Catalog</h2>
            <div className="flex gap-4">
              <Link to="/admin/brands" className="bg-navy-900 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors text-sm">
                Brands
              </Link>
              <Link to="/admin/categories" className="bg-navy-900 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors text-sm">
                Categories
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Orders</h2>
            <Link to="/admin/orders" className="bg-navy-900 text-white px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors text-sm">
              View All Orders
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Recent Orders</h2>
          {orders?.results.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-gray-600 font-medium">Customer</th>
                    <th className="pb-3 text-gray-600 font-medium">Phone</th>
                    <th className="pb-3 text-gray-600 font-medium">Status</th>
                    <th className="pb-3 text-gray-600 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders?.results.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 font-medium text-navy-900">{order.customer_name}</td>
                      <td className="py-3 text-gray-600">{order.phone}</td>
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
                      <td className="py-3 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
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
