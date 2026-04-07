import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Skeleton';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Products() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    axios.get(`${API}/api/products/categories`).then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    let catId = selectedCategory;
    if (categorySlug) {
      const found = categories.find(c => c.slug === categorySlug);
      if (found) catId = found._id;
    }
    const search = searchParams.get('search') || '';
    const params = new URLSearchParams();
    if (catId) params.set('category', catId);
    if (search) params.set('search', search);
    if (sortBy !== 'newest') params.set('sort', sortBy);

    axios.get(`${API}/api/products?${params}`)
      .then(res => setProducts(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categorySlug, selectedCategory, sortBy, searchParams, categories]);

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-[350px] md:h-[200px] bg-gradient-to-r from-primary to-green-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {categorySlug ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Products'}
            </h1>
            <p className="text-green-100 text-sm md:text-base">
              Fresh picks, honest prices — delivered to your doorstep
            </p>
          </div>
          <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 text-6xl md:text-8xl opacity-20">
            🛒
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => setSelectedCategory('')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${!selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-card dark:text-gray-300 hover:bg-gray-200'}`}>
          All
        </button>
        {categories.map(cat => (
          <button key={cat._id} onClick={() => setSelectedCategory(cat._id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat._id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-card dark:text-gray-300 hover:bg-gray-200'}`}>
            {cat.icon} {cat.name}
          </button>
        ))}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="ml-auto px-4 py-2 rounded-lg border dark:bg-dark-card dark:border-gray-600 dark:text-white text-sm">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
      </div>
    </div>
  );
}
