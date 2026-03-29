'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrders } from '@/lib/hooks';
import { useUpdateOrderStatus } from '@/lib/adminHooks';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('auth_token')) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleStatusChange = async (orderId: string, status: string) => {
    await updateStatus.mutateAsync({ id: orderId, status });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-300 hover:text-white text-sm">← Dashboard</Link>
        <h1 className="text-xl font-bold text-yellow-400">Orders</h1>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-600 font-medium">Customer</th>
                    <th className="text-left px-6 py-4 text-gray-600 font-medium">Phone</th>
                    <th className="text-left px-6 py-4 text-gray-600 font-medium">Items</th>
                    <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left px-6 py-4 text-gray-600 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data?.results.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.customer_name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <a href={`tel:${order.phone}`} className="hover:text-yellow-600">{order.phone}</a>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.items?.length ?? 0} item(s)</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
