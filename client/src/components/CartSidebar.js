import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingCart, FiTrendingUp, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CartSidebar() {
  const { items, removeItem, updateQty, total, isOpen, closeCart, addItem } = useCart();
  const [bestsellers, setBestsellers] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Auto-close when all items removed
  useEffect(() => {
    if (isOpen && items.length === 0) {
      const timer = setTimeout(() => closeCart(), 800);
      return () => clearTimeout(timer);
    }
  }, [items.length, isOpen]);

  // Fetch bestsellers on mount
  useEffect(() => {
    axios
      .get(`${API}/api/products/collection/best-sellers`)
      .then((res) => {
        const prods = res.data.products || [];
        setBestsellers(prods);
        const defaults = {};
        prods.forEach((p) => {
          if (p.variants?.[0]) defaults[p._id] = p.variants[0];
        });
        setSelectedVariants(defaults);
      })
      .catch(() => {});
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = dir === 'left' ? -200 : 200;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const variant = selectedVariants[product._id] || product.variants?.[0];
    if (!variant) return;
    addItem(product, variant);
    toast.success(`${product.name} added to cart`);
  };

  const handleProductClick = (productId) => {
    closeCart();
    navigate(`/product/${productId}`);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-dark-card z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold dark:text-white">
            Cart ({items.length})
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">

          {/* 1. Cart Items */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-gray-400">
              <FiShoppingCart size={48} className="mb-4" />
              <p className="text-lg font-medium dark:text-white">Your cart is empty</p>
              <p className="text-sm mt-1 mb-6">Add items to get started</p>
              <Link
                to="/products"
                onClick={closeCart}
                className="btn-primary flex items-center gap-2"
              >
                <FiShoppingCart size={16} />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="px-6 py-4 space-y-4">
              {items.map(item => {
                const itemMrp = item.variant.mrp || item.variant.price;
                const hasDiscount = itemMrp > item.variant.price;
                return (
                  <div key={item.key} className="flex gap-3 py-3 border-b dark:border-gray-700 last:border-0">
                    <img
                      src={item.product.images?.[0] || 'https://via.placeholder.com/60'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold dark:text-white line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.variant.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-bold text-primary">
                          ₹{item.variant.price * item.qty}
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-gray-400 line-through">
                            ₹{itemMrp * item.qty}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center border rounded-lg dark:border-gray-600">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="px-2 text-sm font-medium dark:text-white">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.key, Math.min(5, item.qty + 1))}
                          disabled={item.qty >= 5}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg disabled:opacity-30"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-red-400 hover:text-red-600 p-1 self-end"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Bestsellers Mini Slider — only when cart has items */}
          {items.length > 0 && bestsellers.length > 0 && (
            <div className="border-t dark:border-gray-700 px-4 py-4">
              {/* Slider Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold dark:text-white uppercase tracking-wide">You May Also Like ❤️</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scroll('left')}
                    className="p-1 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    className="p-1 rounded-full border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Row */}
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth pb-1 items-stretch"
              >
                {bestsellers.map((product) => {
                  const selected = selectedVariants[product._id] || product.variants?.[0];
                  const mrp = selected?.mrp || selected?.price;
                  const price = selected?.price;
                  const hasDiscount = mrp > price;
                  const discountPct = hasDiscount
                    ? Math.round(((mrp - price) / mrp) * 100)
                    : 0;
                  const inCart = items.some(
                    (item) => item.product._id === product._id
                  );

                  return (
                    <div
                      key={product._id}
                      className="flex-shrink-0 w-[140px] cursor-pointer group flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2"
                        onClick={() => handleProductClick(product._id)}
                      >
                        <img
                          src={product.images?.[0] || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                        {product.rating > 0 && (
                          <span className="absolute top-1 left-1 flex items-center gap-0.5 text-[8px] font-bold bg-yellow-400 text-yellow-900 px-1 py-0.5 rounded">
                            <FiStar size={6} className="fill-yellow-900" />
                            {product.rating.toFixed(1)}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="absolute top-1 right-1 text-[8px] font-bold bg-red-500 text-white px-1 py-0.5 rounded">
                            -{discountPct}%
                          </span>
                        )}
                        {inCart && (
                          <span className="absolute bottom-1 left-1 text-[7px] font-bold bg-primary text-white px-1.5 py-0.5 rounded">
                            IN CART
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <h4
                        className="text-[11px] font-semibold text-gray-800 dark:text-white line-clamp-2 leading-tight mb-1"
                        onClick={() => handleProductClick(product._id)}
                      >
                        {product.name}
                      </h4>

                      {/* Variant Boxes - fixed min-height to keep cards aligned */}
                      <div
                        className="flex flex-wrap gap-1 mb-1 min-h-[22px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {product.variants && product.variants.length > 1 && product.variants.map((v) => (
                          <button
                            key={v.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [product._id]: v,
                              }));
                            }}
                            className={`px-1.5 py-0.5 text-[9px] font-medium rounded border transition-colors ${
                              selected?.name === v.name
                                ? 'bg-primary text-white border-primary'
                                : 'bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary'
                            }`}
                          >
                            {v.name}
                          </button>
                        ))}
                      </div>

                      {/* Price Row */}
                      <div
                        className="flex items-center gap-1.5 mt-auto mb-2"
                        onClick={() => handleProductClick(product._id)}
                      >
                        <span className="text-[12px] font-bold text-primary">
                          ₹{price}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{mrp}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-colors active:scale-95 ${
                          inCart
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        <FiShoppingCart size={10} />
                        {inCart ? 'Added' : 'Add to Cart'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Footer — Subtotal / Total */}
        {items.length > 0 && (
          <div className="border-t dark:border-gray-700 px-6 py-4 space-y-3 bg-gray-50 dark:bg-dark-bg">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Delivery</span>
              <span className="text-primary font-medium">
                {total >= 299 ? 'FREE' : '₹29'}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold dark:text-white pt-2 border-t dark:border-gray-700">
              <span>Total</span>
              <span>₹{total < 299 ? total + 29 : total}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              <FiShoppingCart size={16} />
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
