import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiX, FiShoppingCart, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function BestsellersSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Fetch bestsellers when opened for the first time
  useEffect(() => {
    if (isOpen && products.length === 0) {
      setLoading(true);
      axios
        .get(`${API}/api/products/collection/best-sellers`)
        .then((res) => setProducts(res.data.products || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === 'up' ? -200 : 200;
    scrollRef.current.scrollBy({ top: amount, behavior: 'smooth' });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const variant = product.variants?.[0];
    if (!variant) return;
    addItem(product, variant);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      {/* Floating Tab — visible when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-white px-2 py-4 rounded-r-xl shadow-lg hover:shadow-xl hover:px-3 transition-all duration-300 writing-mode-vertical flex items-center gap-2 group"
          aria-label="Open Bestsellers"
        >
          <FiTrendingUp size={16} className="rotate-90" />
          <span className="text-xs font-bold tracking-wide uppercase"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            Bestsellers
          </span>
        </button>
      )}

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-dark-card z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 bg-gradient-to-r from-primary to-green-600 text-white">
          <div className="flex items-center gap-2">
            <FiTrendingUp size={18} />
            <h2 className="text-base font-bold">Bestsellers</h2>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {products.length} items
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Scroll Buttons */}
        <div className="flex items-center justify-center gap-2 py-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-dark-bg">
          <button
            onClick={() => scroll('up')}
            className="p-1.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll up"
          >
            <FiChevronLeft size={14} className="rotate-90" />
          </button>
          <span className="text-xs text-gray-400">Scroll</span>
          <button
            onClick={() => scroll('down')}
            className="p-1.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Scroll down"
          >
            <FiChevronRight size={14} className="rotate-90" />
          </button>
        </div>

        {/* Product List — vertical scroll */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        >
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
                <div className="flex-1 py-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiTrendingUp size={36} className="mb-3" />
              <p className="text-sm">No bestsellers found</p>
            </div>
          ) : (
            products.map((product) => {
              const price = product.variants?.[0]?.price;
              const minPrice = product.variants?.length
                ? Math.min(...product.variants.map((v) => v.price))
                : null;
              const maxPrice = product.variants?.length
                ? Math.max(...product.variants.map((v) => v.price))
                : null;

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="flex gap-3 p-2 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    {product.rating > 0 && (
                      <span className="absolute bottom-1 left-1 flex items-center gap-0.5 text-[10px] font-bold bg-yellow-400 text-yellow-900 px-1 py-0.5 rounded">
                        <FiStar size={8} className="fill-yellow-900" />
                        {product.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      {product.category?.name && (
                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-primary">
                        {minPrice != null && maxPrice != null
                          ? minPrice === maxPrice
                            ? `₹${minPrice}`
                            : `₹${minPrice} - ₹${maxPrice}`
                          : '—'}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                        aria-label="Add to cart"
                      >
                        <FiShoppingCart size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {products.length > 0 && (
          <div className="border-t dark:border-gray-700 px-4 py-3">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/products');
              }}
              className="w-full py-2 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </>
  );
}
