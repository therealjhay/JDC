import { useEffect, useMemo, useState } from 'react';
import { useOrders } from '@/lib/hooks';
import { useUpdateOrderStatus } from '@/lib/adminHooks';
import { useRequireAdmin } from '@/lib/useRequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDebouncedValue } from '@/lib/useDebouncedValue';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  useRequireAdmin();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusError, setStatusError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const PAGE_SIZE = 20;
  const { data, isLoading, refetch } = useOrders({
    page: String(page),
    page_size: String(PAGE_SIZE),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });
  const updateStatus = useUpdateOrderStatus();
  const totalPages = useMemo(() => {
    if (!data?.count) return 1;
    return Math.max(1, Math.ceil(data.count / PAGE_SIZE));
  }, [data?.count]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleStatusChange = async (orderId: string, status: string) => {
    setStatusMessage('');
    setStatusError('');
    setUpdatingId(orderId);
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      setStatusMessage('Order status updated.');
      refetch();
    } catch {
      setStatusError('Failed to update order status.');
    } finally {
      setUpdatingId(null);
      setTimeout(() => {
        setStatusMessage('');
        setStatusError('');
      }, 2000);
    }
  };

  return (
    <AdminLayout title="Orders" backHref="/admin" backLabel="← Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by customer or phone..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-primary-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {data?.count ?? 0} order{(data?.count ?? 0) === 1 ? '' : 's'}
            </div>
          </div>
        </div>
        {(statusMessage || statusError) && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${statusError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {statusError || statusMessage}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500"></div>
            </div>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Customer</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Phone</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Items</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Status</th>
                    <th className="text-left px-4 sm:px-6 py-3 text-gray-600 font-medium text-xs sm:text-sm">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data?.results.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 font-medium text-primary-900 text-xs sm:text-sm">{order.customer_name}</td>
                      <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm">
                        <a href={`tel:${order.phone}`} className="hover:text-accent-600">{order.phone}</a>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm">{order.items?.length ?? 0} item(s)</td>
                      <td className="px-4 sm:px-6 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-400 ${
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
                      <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs sm:text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm"
            >
              First
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data?.previous}
              className="px-4 py-2 bg-primary-900 text-white rounded-lg disabled:opacity-40 hover:bg-primary-700 transition-colors text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.next}
              className="px-4 py-2 bg-primary-900 text-white rounded-lg disabled:opacity-40 hover:bg-primary-700 transition-colors text-sm"
            >
              Next
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
