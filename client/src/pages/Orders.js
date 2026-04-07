import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { generateInvoice } from '../utils/generateInvoice';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const statusConfig = {
  pending: { icon: FiClock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Pending' },
  confirmed: { icon: FiPackage, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Confirmed' },
  packing: { icon: FiPackage, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', label: 'Packing' },
  shipped: { icon: FiTruck, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', label: 'Shipped' },
  delivered: { icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Delivered' },
  cancelled: { icon: FiClock, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Cancelled' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API}/api/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8"><div className="skeleton h-40 rounded-xl mb-4" /><div className="skeleton h-40 rounded-xl" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <FiPackage className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">No orders yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Start shopping to see your orders here!</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const status = statusConfig[order.orderStatus] || statusConfig.pending;
          const StatusIcon = status.icon;
          return (
            <div key={order._id} className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold dark:text-white">{order.orderId}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                    <StatusIcon size={14} /> {status.label}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 pr-4">
                    <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="text-sm font-medium dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.variant} x{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{order.items.length} item(s)</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {order.paymentStatus?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg dark:text-white">₹{order.totalAmount}</span>
                  <button
                    onClick={() => generateInvoice(order)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    title="Download Invoice"
                  >
                    <FiDownload size={12} /> Invoice
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
