import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiUser, FiTruck, FiShield, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { generateInvoice } from '../utils/generateInvoice';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '', phone: '', address: '', landmark: '',
    city: '', state: '', pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeVerified, setPincodeVerified] = useState(false);

  // Modal states: null -> 'method' -> 'processing' -> 'success'
  const [modalStep, setModalStep] = useState(null); // null | method | processing | success
  const [paymentMethod, setPaymentMethod] = useState(''); // cod | upi
  const [createdOrder, setCreatedOrder] = useState(null);

  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [showStateDrop, setShowStateDrop] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCityDrop, setShowCityDrop] = useState([]);
  const stateRef = useRef(null);
  const cityRef = useRef(null);

  // Auto-fetch city & state from pincode
  useEffect(() => {
    if (form.pincode.length === 6) {
      setPincodeLoading(true);
      setPincodeVerified(false);
      axios.get(`https://api.postalpincode.in/pincode/${form.pincode}`)
        .then(res => {
          const data = res.data?.[0];
          if (data?.Status === 'Success' && data.PostOffice?.length > 0) {
            const offices = data.PostOffice;
            const po = offices[0];
            setForm(prev => ({ ...prev, city: po.District || po.Name || prev.city, state: po.State || prev.state }));
            const uniqueCities = [...new Set(offices.map(o => o.District))];
            const areas = offices.map(o => o.Name);
            setCitySuggestions([...uniqueCities, ...areas]);
            setPincodeVerified(true);
          } else {
            toast.error('Invalid pincode');
            setCitySuggestions([]);
          }
        })
        .catch(() => { setCitySuggestions([]); })
        .finally(() => setPincodeLoading(false));
    } else {
      setPincodeVerified(false);
      setCitySuggestions([]);
    }
  }, [form.pincode]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (stateRef.current && !stateRef.current.contains(e.target)) setShowStateDrop(false);
      if (cityRef.current && !cityRef.current.contains(e.target)) setShowCityDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'state') {
      setStateSuggestions(INDIAN_STATES.filter(s => s.toLowerCase().includes(value.toLowerCase())));
      setShowStateDrop(value.length > 0);
    }
    if (name === 'city') {
      setShowCityDrop(value.length > 0 && citySuggestions.some(c => c.toLowerCase().includes(value.toLowerCase())));
    }
    if (name === 'pincode') setPincodeVerified(false);
  };

  // Step 1: Submit form -> show payment method selection
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    setModalStep('method');
  };

  // Step 2: User picks COD or UPI -> create order on backend
  const handleSelectPayment = async (method) => {
    setPaymentMethod(method);
    setModalStep('processing');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const orderItems = items.map(i => ({
        product: i.product._id, name: i.product.name,
        image: i.product.images?.[0] || '', variant: i.variant.name,
        price: i.variant.price, qty: i.qty,
      }));

      const { data } = await axios.post(`${API}/api/orders`, {
        items: orderItems,
        shippingAddress: form,
        paymentMethod: method,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setCreatedOrder({ ...data, items: orderItems, shippingAddress: form, subtotal, shipping, totalAmount: total, createdAt: new Date().toISOString(), paymentStatus: method === 'cod' ? 'pending' : 'paid', orderStatus: 'confirmed' });

      // Simulate processing delay
      setTimeout(() => setModalStep('success'), method === 'upi' ? 2000 : 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed');
      setModalStep('method');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (modalStep === 'success') return; // don't close on success
    setModalStep(null);
  };

  const handleDone = () => {
    clearCart();
    navigate(`/order-success/${createdOrder?.orderId}`);
  };

  if (items.length === 0 && !modalStep) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Add some items before checkout</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 text-sm">
          <FiArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold dark:text-white mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Contact */}
              <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FiUser size={18} className="text-primary" />
                  <h2 className="font-semibold dark:text-white">Contact Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="10-digit number" maxLength={10} className="input-field" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FiMapPin size={18} className="text-primary" />
                  <h2 className="font-semibold dark:text-white">Delivery Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Pincode *</label>
                    <div className="relative">
                      <input
                        name="pincode" value={form.pincode}
                        onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 6); setForm(prev => ({ ...prev, pincode: val })); if (val.length !== 6) setPincodeVerified(false); }}
                        required placeholder="6-digit pincode" maxLength={6}
                        className={`input-field pr-10 ${pincodeVerified ? 'border-green-500' : ''}`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {pincodeLoading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          : pincodeVerified ? <FiCheck className="text-green-500" size={16} /> : null}
                      </div>
                    </div>
                    {pincodeVerified && <p className="text-xs text-green-500 mt-1">Area found! City & state auto-filled.</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Address *</label>
                    <textarea name="address" value={form.address} onChange={handleChange} required placeholder="House no., Building, Street, Area" rows={3} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Landmark <span className="text-gray-400">(optional)</span></label>
                    <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Near school, temple, bus stop etc." className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* City with suggestions */}
                    <div className="relative" ref={cityRef}>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">City *</label>
                      <div className="relative">
                        <input name="city" value={form.city} onChange={handleChange} onFocus={() => { if (citySuggestions.length > 0 && form.city) setShowCityDrop(true); }} required placeholder="City" className="input-field pr-8" autoComplete="off" />
                        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                      {showCityDrop && citySuggestions.filter(c => c.toLowerCase().includes(form.city.toLowerCase())).length > 0 && (
                        <div className="absolute z-30 w-full mt-1 bg-white dark:bg-dark-card border dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {citySuggestions.filter(c => c.toLowerCase().includes(form.city.toLowerCase())).map(c => (
                            <button key={c} type="button" onClick={() => { setForm(prev => ({ ...prev, city: c })); setShowCityDrop(false); }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 dark:hover:bg-primary/20 text-gray-700 dark:text-gray-300">{c}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* State with suggestions */}
                    <div className="relative" ref={stateRef}>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">State *</label>
                      <div className="relative">
                        <input name="state" value={form.state} onChange={handleChange} onFocus={() => form.state && setShowStateDrop(true)} required placeholder="State" className="input-field pr-8" autoComplete="off" />
                        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                      {showStateDrop && stateSuggestions.length > 0 && (
                        <div className="absolute z-30 w-full mt-1 bg-white dark:bg-dark-card border dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {stateSuggestions.map(s => (
                            <button key={s} type="button" onClick={() => { setForm(prev => ({ ...prev, state: s })); setShowStateDrop(false); }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 dark:hover:bg-primary/20 text-gray-700 dark:text-gray-300">{s}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FiTruck size={18} className="text-primary" />
                  <h2 className="font-semibold dark:text-white">Delivery</h2>
                </div>
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Estimated Delivery</p>
                    <p className="text-xs text-green-600 dark:text-green-500">Within 30-45 minutes</p>
                  </div>
                  <span className="text-sm font-bold text-green-700 dark:text-green-400">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
                <FiShield size={18} /> Continue to Payment
              </button>
              <p className="text-xs text-center text-gray-400">100% Secure Payment</p>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm sticky top-20">
              <h3 className="font-semibold mb-4 dark:text-white">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.key} className="flex items-center gap-3">
                    <img src={item.product.images?.[0] || 'https://via.placeholder.com/50'} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium dark:text-white truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.variant.name} x {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold dark:text-white">₹{item.variant.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <hr className="dark:border-gray-700 mb-3" />
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Subtotal ({items.length} items)</span><span className="dark:text-white">₹{subtotal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Delivery</span>{shipping === 0 ? <span className="text-green-500 font-medium">FREE</span> : <span className="dark:text-white">₹{shipping}</span>}</div>
              </div>
              {shipping > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-2 mb-3">
                  <p className="text-xs text-orange-600 dark:text-orange-400">Add ₹{300 - subtotal} more for <span className="font-bold">FREE delivery</span></p>
                </div>
              )}
              <hr className="dark:border-gray-700 my-3" />
              <div className="flex justify-between text-lg font-bold dark:text-white"><span>Total</span><span className="text-primary">₹{total}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PAYMENT MODAL ===== */}
      {modalStep && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md p-0 overflow-hidden">

            {/* STEP 1: Choose Payment Method */}
            {modalStep === 'method' && (
              <>
                <div className="bg-primary p-5 text-white text-center">
                  <h3 className="text-lg font-bold">Choose Payment Method</h3>
                  <p className="text-sm opacity-90 mt-1">Total: <span className="font-bold text-xl">₹{total}</span></p>
                </div>
                <div className="p-6 space-y-4">
                  {/* COD */}
                  <button
                    onClick={() => handleSelectPayment('cod')}
                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group"
                  >
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold dark:text-white group-hover:text-primary">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pay when your order arrives at your doorstep</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </button>

                  {/* UPI */}
                  <button
                    onClick={() => handleSelectPayment('upi')}
                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group"
                  >
                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold dark:text-white group-hover:text-primary">Pay via UPI</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Google Pay, PhonePe, Paytm or any UPI app</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
                <div className="px-6 pb-5">
                  <button onClick={closeModal} className="w-full text-sm text-gray-500 hover:text-primary py-2">Cancel</button>
                </div>
              </>
            )}

            {/* STEP 2: Processing */}
            {modalStep === 'processing' && (
              <div className="p-10 text-center">
                <div className="mx-auto w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                <h3 className="text-lg font-bold dark:text-white mb-2">
                  {paymentMethod === 'upi' ? 'Processing UPI Payment' : 'Placing Order'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {paymentMethod === 'upi'
                    ? <>Confirming payment of <span className="font-bold text-primary">₹{total}</span> via UPI...</>
                    : 'Confirming your Cash on Delivery order...'}
                </p>
              </div>
            )}

            {/* STEP 3: Success */}
            {modalStep === 'success' && createdOrder && (
              <>
                <div className="bg-green-500 p-5 text-white text-center">
                  <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Order Confirmed!</h3>
                  <p className="text-sm opacity-90 mt-1">Order ID: <span className="font-bold">{createdOrder.orderId}</span></p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Payment Info */}
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-bg rounded-lg p-3">
                    <div>
                      <p className="text-xs text-gray-400">Payment Method</p>
                      <p className="text-sm font-bold dark:text-white">
                        {paymentMethod === 'cod' ? '💰 Cash on Delivery' : '📱 UPI Payment'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Amount</p>
                      <p className="text-sm font-bold text-primary">₹{total}</p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className={`flex items-center gap-2 rounded-lg p-3 ${
                    paymentMethod === 'cod'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <span className="text-lg">{paymentMethod === 'cod' ? '⏳' : '✅'}</span>
                    <div>
                      <p className={`text-sm font-semibold ${
                        paymentMethod === 'cod'
                          ? 'text-yellow-700 dark:text-yellow-400'
                          : 'text-green-700 dark:text-green-400'
                      }`}>
                        {paymentMethod === 'cod'
                          ? 'Pay on Delivery'
                          : 'Payment Successful'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {paymentMethod === 'cod'
                          ? 'Please keep exact change ready'
                          : `₹${total} paid via UPI`}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Order Summary</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">{items.length} items</span><span className="dark:text-white">₹{subtotal}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Delivery</span><span className="text-green-500 font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                      <hr className="my-1 dark:border-gray-700" />
                      <div className="flex justify-between text-sm font-bold"><span className="dark:text-white">Total</span><span className="text-primary">₹{total}</span></div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <button onClick={() => generateInvoice(createdOrder)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors">
                    📄 Download Invoice
                  </button>
                  <button onClick={handleDone} className="btn-primary w-full py-3">
                    View Order Details
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
