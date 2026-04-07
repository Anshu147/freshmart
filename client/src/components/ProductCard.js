import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [wishlist, setWishlist] = useState(getWishlist);

  const variant = product.variants?.[selectedVariant] || product.variants?.[0];

  const isWishlisted = useMemo(
    () => wishlist.includes(product._id),
    [wishlist, product._id]
  );

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const updated = prev.includes(product._id)
        ? prev.filter((id) => id !== product._id)
        : [...prev, product._id];
      saveWishlist(updated);
      return updated;
    });
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!variant) return;
    addItem(product, variant);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="card group cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart
            size={18}
            className={
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 dark:text-gray-300'
            }
          />
        </button>
        {/* Discount Badge */}
        {variant?.mrp && variant.mrp > variant.price && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded-md">
            {Math.round(((variant.mrp - variant.price) / variant.mrp) * 100)}% OFF
          </span>
        )}
        {/* Category Badge */}
        {product.category?.name && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-primary/90 text-white rounded-md">
            {product.category.icon ? `${product.category.icon} ` : ''}{product.category.name}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Variant Box Selector */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.variants.map((v, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedVariant(i); }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md border transition ${
                  selectedVariant === i
                    ? 'border-primary bg-green-50 text-primary dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">₹{variant?.price || 0}</span>
          {variant?.mrp && variant.mrp > variant.price && (
            <span className="text-sm text-gray-400 line-through">₹{variant.mrp}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!variant?.stock}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors active:scale-95 disabled:opacity-50"
        >
          <FiShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
