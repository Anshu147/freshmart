import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-dark-card border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-primary">Fresh</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">Cart</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Your trusted grocery delivery partner. Fresh produce and everyday essentials delivered
              to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=fruits" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Fruits & Vegetables
                </Link>
              </li>
              <li>
                <Link to="/products?category=dairy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Dairy & Bakery
                </Link>
              </li>
              <li>
                <Link to="/products?category=beverages" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Beverages
                </Link>
              </li>
              <li>
                <Link to="/products?category=snacks" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Snacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Who is FreshCart?
                </Link>
              </li>
              <li>
                <Link to="/co-create" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Co-Create With Us
                </Link>
              </li>
              <li>
                <Link to="/radical-honesty" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Radical Honesty
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Subscribe to get exclusive offers and updates.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-dark-bg text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-r-lg hover:bg-primary-dark transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {currentYear} FreshCart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy-policy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/refund-policy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
              Refund Policy
            </Link>
            <Link to="/shipping-policy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
