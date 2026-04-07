import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiChevronLeft, FiStar, FiSend } from 'react-icons/fi';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [relatedVariants, setRelatedVariants] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlisted(wishlist.includes(id));
  }, [id]);

  // Fetch reviews + related products when product loads
  useEffect(() => {
    if (!product) return;

    axios.get(`${API}/api/reviews/${id}`).then(r => setReviews(r.data)).catch(() => {});

    // Fetch related products from same category
    if (product.category?._id || product.category) {
      const catId = product.category?._id || product.category;
      axios.get(`${API}/api/products?category=${catId}&limit=6`)
        .then(r => {
          const prods = r.data.products.filter(p => p._id !== id);
          setRelatedProducts(prods);
          const defaults = {};
          prods.forEach(p => { if (p.variants?.[0]) defaults[p._id] = 0; });
          setRelatedVariants(defaults);
        })
        .catch(() => {});
    }
  }, [id, product]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlisted) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist.filter(x => x !== id)));
    } else {
      localStorage.setItem('wishlist', JSON.stringify([...wishlist, id]));
    }
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.variants[selectedVariant];
    addItem(product, variant, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API}/api/reviews/${id}`, reviewForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews([data, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-gray-200 dark:bg-gray-700 rounded-2xl h-96" />
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-16 dark:text-white">Product not found</div>;

  const variant = product.variants?.[selectedVariant] || product.variants?.[0];
  const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/400'];
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary mb-6 text-sm">
        <FiChevronLeft /> Back
      </button>

      {/* ===== MAIN PRODUCT SECTION ===== */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Images */}
        <div className="md:w-1/2">
          <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm">
            <img src={images[selectedImage]} alt={product.name} className="w-full aspect-square object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 flex flex-col gap-5">
          {/* Title */}
          <div>
            {product.category?.name && (
              <p className="text-sm text-primary font-medium mb-1">{product.category.icon} {product.category.name}</p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white">{product.name}</h1>
          </div>

          {/* Rating summary */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
              {avgRating} <FiStar size={12} className="fill-white" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{reviews.length || product.numReviews} ratings</span>
          </div>

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div>
              <p className="text-sm font-medium mb-2 dark:text-gray-300">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button key={i} onClick={() => { setSelectedVariant(i); setQty(1); }} disabled={v.stock === 0}
                    className={`px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all ${
                      selectedVariant === i
                        ? 'border-primary bg-green-50 text-primary dark:bg-green-900/20 dark:border-primary'
                        : v.stock === 0
                          ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed line-through'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary dark:text-gray-300'
                    }`}>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-primary">₹{variant?.price || 0}</span>
            {variant?.mrp && variant.mrp > variant.price && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{variant.mrp}</span>
                <span className="text-sm font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                  {Math.round(((variant.mrp - variant.price) / variant.mrp) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          {variant?.stock > 0 && variant?.stock <= 5 && (
            <p className="text-sm text-orange-500 font-medium">Only {variant.stock} left in stock!</p>
          )}
          {variant?.stock === 0 && (
            <p className="text-sm text-red-500 font-medium">Out of stock</p>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 rounded-lg dark:border-gray-600">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg">
                <FiMinus size={16} />
              </button>
              <span className="px-4 font-bold dark:text-white text-lg min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(5, qty + 1))} disabled={qty >= 5} className="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg disabled:opacity-30">
                <FiPlus size={16} />
              </button>
            </div>
            <button onClick={handleAddToCart} disabled={!variant?.stock}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 text-base py-3">
              <FiShoppingCart /> Add to Cart
            </button>
            <button onClick={toggleWishlist}
              className={`p-3 rounded-lg border-2 transition ${wishlisted ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-red-300'}`}>
              <FiHeart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-4 border-t dark:border-gray-700">
              <h3 className="font-semibold mb-2 dark:text-white">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== REVIEWS SECTION ===== */}
      <div className="mt-12">
        <h2 className="text-xl font-bold dark:text-white mb-6">Ratings & Reviews</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm sticky top-20">
              <h3 className="font-semibold mb-4 dark:text-white">Write a Review</h3>
              {user ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Star Selector */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Rating</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform hover:scale-110">
                          <FiStar size={28}
                            className={star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share your experience..."
                    rows={3}
                    className="input-field"
                  />
                  <button type="submit" disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    <FiSend size={16} /> {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <a href="/login" className="text-primary font-medium hover:underline">Login</a> to write a review
                </p>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-dark-card rounded-xl">
                <p className="text-4xl mb-2">💬</p>
                <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-sm dark:text-white">{review.user?.name || 'User'}</p>
                          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                        {review.rating} <FiStar size={10} className="fill-white" />
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== RELATED PRODUCTS ===== */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold dark:text-white mb-6">You May Also Like ❤️</h2>
          <div className="grid grid-cols-5 gap-3">
            {relatedProducts.slice(0, 5).map(p => {
              const vi = relatedVariants[p._id] ?? 0;
              const v = p.variants?.[vi] || p.variants?.[0];
              const hasDiscount = v?.mrp && v.mrp > v.price;
              return (
                <div key={p._id} className="cursor-pointer group">
                  <div
                    className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => { navigate(`/product/${p._id}`); window.scrollTo(0, 0); }}
                  >
                    <img src={p.images?.[0] || 'https://via.placeholder.com/200'} alt={p.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-2.5">
                      <p className="text-xs font-semibold dark:text-white line-clamp-2 leading-tight min-h-[32px]">{p.name}</p>
                    </div>
                  </div>
                  {/* Variant Buttons */}
                  {p.variants?.length > 1 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 px-1" onClick={e => e.stopPropagation()}>
                      {p.variants.map((variant, idx) => (
                        <button
                          key={variant.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRelatedVariants(prev => ({ ...prev, [p._id]: idx }));
                          }}
                          className={`px-1.5 py-0.5 text-[9px] font-medium rounded border transition-colors ${
                            vi === idx
                              ? 'bg-primary text-white border-primary'
                              : 'bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary'
                          }`}
                        >
                          {variant.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Price */}
                  <div
                    className="flex items-center gap-1.5 mt-1.5 px-1 cursor-pointer"
                    onClick={() => { navigate(`/product/${p._id}`); window.scrollTo(0, 0); }}
                  >
                    <span className="text-sm font-bold text-primary">₹{v?.price || 0}</span>
                    {hasDiscount && (
                      <span className="text-[11px] text-gray-400 line-through">₹{v.mrp}</span>
                    )}
                  </div>
                  {/* Add to Cart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(p, v);
                      toast.success(`${p.name} added to cart!`);
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold bg-primary text-white hover:bg-primary-dark transition-colors active:scale-95"
                  >
                    <FiShoppingCart size={11} /> Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
