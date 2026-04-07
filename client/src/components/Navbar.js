import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiHeart,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiSearch,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, openCart } = useCart();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = (
    <>
      <Link
        to="/products"
        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        Products
      </Link>
      <Link
        to="/about"
        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        About
      </Link>
      <Link
        to="/co-create"
        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        Co-Create
      </Link>
      <Link
        to="/radical-honesty"
        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        Radical Honesty
      </Link>
      {user && (
        <>
          <Link
            to="/wishlist"
            className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Wishlist
          </Link>
          <Link
            to="/orders"
            className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>
        </>
      )}
      {user?.role === 'admin' && (
        <Link
          to="/admin"
          className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          Admin
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-card shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Fresh</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">Cart</span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 ml-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Wishlist */}
            {user && (
              <Link
                to="/wishlist"
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:inline-flex"
                aria-label="Wishlist"
              >
                <FiHeart size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link
              onClick={openCart}
              className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="User menu"
                >
                  <FiUser size={20} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.phone ? `+91 ${user.phone}` : user.email}
                      </p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FiShoppingCart size={16} />
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <FiUser size={16} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-dark-bg z-40 overflow-y-auto">
          <div className="px-4 py-4 space-y-2" ref={mobileMenuRef}>
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 py-2.5 text-sm"
                />
              </div>
            </form>

            {navLinks}

            {!user && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-2.5 text-sm font-medium text-white bg-primary rounded-lg"
                >
                  Login
                </Link>
              </div>
            )}

            {user && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.phone ? `+91 ${user.phone}` : user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
