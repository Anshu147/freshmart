import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import AboutFreshCart from './pages/AboutFreshCart';
import CoCreate from './pages/CoCreate';
import RadicalHonesty from './pages/RadicalHonesty';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermsOfService from './pages/TermsOfService';
import ShippingPolicy from './pages/ShippingPolicy';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CartSidebar from './components/CartSidebar';
import BestsellersSidebar from './components/BestsellersSidebar';

export default function App() {
  return (
    <Routes>
      {/* Admin — separate layout */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

      {/* Main site — everything else */}
      <Route path="*" element={
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors">
          <Navbar />
          <main className="min-h-[calc(100vh-4px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Navigate to="/login" replace />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:categorySlug" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/about" element={<AboutFreshCart />} />
              <Route path="/co-create" element={<CoCreate />} />
              <Route path="/radical-honesty" element={<RadicalHonesty />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
            </Routes>
          </main>
          <Footer />
          <CartSidebar />
          <BestsellersSidebar />
          <ChatWidget />
        </div>
      } />
    </Routes>
  );
}
