import { useState, useEffect } from 'react';
import axios from 'axios';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import ProductSlider from '../components/ProductSlider';
import { SkeletonCard } from '../components/Skeleton';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [essentials, setEssentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/products/categories`),
      axios.get(`${API}/api/products/collection/best-sellers`),
      axios.get(`${API}/api/products/collection/trending`),
      axios.get(`${API}/api/products/collection/daily-essentials`),
    ])
      .then(([catRes, bsRes, trendRes, essRes]) => {
        setCategories(catRes.data);
        setBestSellers(bsRes.data.products);
        setTrending(trendRes.data.products);
        setEssentials(essRes.data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeroBanner />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Shop by Category</h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <CategoryGrid categories={categories} />
        )}
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <ProductSlider title="🔥 Best Sellers" products={bestSellers} />
        )}
      </section>

      {/* Trending Deals */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <ProductSlider title="⚡ Trending Deals" products={trending} />
        )}
      </section>

      {/* Daily Essentials */}
      <section className="max-w-7xl mx-auto px-4 py-4 pb-12">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <ProductSlider title="🛒 Daily Essentials" products={essentials} />
        )}
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-primary to-green-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Get 20% Off Your First Order!</h2>
          <p className="text-lg mb-6 text-green-100">Use code FRESH20 at checkout</p>
          <a href="/products" className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition">
            Shop Now
          </a>
        </div>
      </section>

      {/* Fresh Picks - Grocery Reels */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Fresh Picks</h2>
          <span className="text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">Swipe to explore</span>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory">
          {[
            { emoji: '🍎', title: 'Fresh Fruits', subtitle: 'Farm to Home', bg: 'from-red-400 to-orange-400', tag: 'Season Best', views: '12K' },
            { emoji: '🥬', title: 'Green Veggies', subtitle: 'Organic Picks', bg: 'from-green-400 to-emerald-500', tag: 'Organic', views: '8.5K' },
            { emoji: '🥛', title: 'Dairy Fresh', subtitle: 'Morning Delivery', bg: 'from-blue-300 to-cyan-400', tag: 'Daily Fresh', views: '15K' },
            { emoji: '🍞', title: 'Bakery Items', subtitle: 'Baked Today', bg: 'from-amber-400 to-yellow-400', tag: 'New', views: '6.2K' },
            { emoji: '🥜', title: 'Dry Fruits', subtitle: 'Premium Quality', bg: 'from-orange-400 to-red-400', tag: 'Bestseller', views: '9.8K' },
            { emoji: '🧃', title: 'Fresh Juices', subtitle: 'No Preservatives', bg: 'from-pink-400 to-rose-400', tag: 'Healthy', views: '11K' },
          ].map((reel, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[160px] h-[280px] rounded-2xl overflow-hidden relative cursor-pointer group snap-start"
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${reel.bg}`} />

              {/* Play icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/50 transition-all group-hover:scale-110">
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Big emoji */}
              <div className="absolute top-8 inset-x-0 text-center">
                <span className="text-6xl drop-shadow-lg">{reel.emoji}</span>
              </div>

              {/* Tag */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">{reel.tag}</span>
              </div>

              {/* Views */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <svg className="w-3 h-3 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                <span className="text-[10px] text-white/80 font-medium">{reel.views}</span>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                <p className="text-white font-bold text-sm leading-tight">{reel.title}</p>
                <p className="text-white/70 text-[11px]">{reel.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
