import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CategoryGrid({ categories = [] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Shop by Category
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat._id || cat.slug} variants={itemVariants}>
              <Link
                to={`/products/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-white dark:bg-dark-card hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {cat.icon || cat.emoji || '🛍️'}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
