import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-4 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full mb-6"
            >
              Free delivery on orders above ₹499
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight"
            >
              Fresh Groceries{' '}
              <span className="text-primary">Delivered</span> in Minutes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed"
            >
              Get farm-fresh fruits, vegetables, dairy and everyday essentials
              delivered straight to your doorstep. Quality you can trust, speed
              you can count on.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="btn-primary text-base px-8 py-3"
              >
                Shop Now
              </Link>
              <Link
                to="/products?category=fruits"
                className="btn-outline text-base px-8 py-3"
              >
                Explore Deals
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-10 flex items-center gap-8"
            >
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">10k+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
              </div>
              <div className="w-px h-10 bg-gray-300 dark:bg-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">30 min</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Delivery</p>
              </div>
              <div className="w-px h-10 bg-gray-300 dark:bg-gray-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">50k+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Happy Customers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Illustration / Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="w-80 h-80 xl:w-96 xl:h-96 rounded-full bg-gradient-to-br from-primary/20 to-emerald-200/30 dark:from-primary/10 dark:to-emerald-800/20 flex items-center justify-center">
                <span className="text-[8rem] xl:text-[10rem] select-none">🛒</span>
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-4 px-3 py-2 bg-white dark:bg-dark-card rounded-lg shadow-lg"
              >
                <span className="text-sm font-semibold text-primary">Fresh</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-2 -left-6 px-3 py-2 bg-white dark:bg-dark-card rounded-lg shadow-lg"
              >
                <span className="text-sm font-semibold text-green-600">Organic</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
