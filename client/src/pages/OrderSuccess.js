import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';
import { generateInvoice } from '../utils/generateInvoice';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API}/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrder(res.data))
      .catch(() => {});
  }, [id]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-lg">
        <FiCheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold dark:text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Your order has been placed successfully</p>

        {order && (
          <div className="text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Order ID</span>
              <span className="font-semibold dark:text-white">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Amount</span>
              <span className="font-semibold dark:text-white">₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Payment</span>
              <span className={`font-semibold ${
                order.paymentStatus === 'paid' ? 'text-green-500' :
                order.paymentStatus === 'failed' ? 'text-red-500' : 'text-yellow-500'
              }`}>{order.paymentStatus?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className="font-semibold dark:text-white">{order.orderStatus?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Items</span>
              <span className="font-semibold dark:text-white">{order.items?.length} item(s)</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link to="/orders" className="btn-outline flex-1 text-center">View Orders</Link>
          <Link to="/products" className="btn-primary flex-1 text-center">Continue Shopping</Link>
        </div>

        {order && (
          <button
            onClick={() => generateInvoice(order)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            <FiDownload size={16} /> Download Invoice
          </button>
        )}
      </div>
    </div>
  );
}
