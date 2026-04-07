import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FiHeart } from 'react-icons/fi';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (ids.length === 0) { setLoading(false); return; }
    Promise.all(ids.map(id => axios.get(`${API}/api/products/${id}`).catch(() => null)))
      .then(responses => {
        setProducts(responses.filter(Boolean).map(r => r.data));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">My Wishlist</h1>
      {!loading && products.length === 0 ? (
        <div className="text-center py-16">
          <FiHeart className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
