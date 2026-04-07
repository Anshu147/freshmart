import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  FiPackage, FiShoppingBag, FiTag, FiLayers, FiGrid, FiPercent,
  FiPlus, FiTrash2, FiEdit, FiX, FiChevronDown, FiChevronUp,
  FiLogOut, FiArrowLeft, FiSun, FiMoon,
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const tabs = [
  { id: 'products', label: 'Products', icon: FiPackage },
  { id: 'categories', label: 'Categories', icon: FiGrid },
  { id: 'collections', label: 'Collections', icon: FiLayers },
  { id: 'discounts', label: 'Discounts', icon: FiPercent },
  { id: 'orders', label: 'Orders', icon: FiShoppingBag },
];

const statuses = ['pending', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  packing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form data
  const emptyProduct = { name: '', slug: '', description: '', images: '', category: '', collection: '', tags: '', variants: [{ name: '500g', price: 0, mrp: 0, stock: 0 }] };
  const [productForm, setProductForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', icon: '', description: '' });
  const [collectionForm, setCollectionForm] = useState({ name: '', slug: '', description: '' });
  const [discountForm, setDiscountForm] = useState({ code: '', type: 'percentage', value: 0, minOrder: 0, maxDiscount: '', usageLimit: '', expiresAt: '' });

  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch data
  const fetchProducts = () => axios.get(`${API}/api/products`).then(r => setProducts(r.data.products)).catch(() => {});
  const fetchCategories = () => axios.get(`${API}/api/products/categories`).then(r => setCategories(r.data)).catch(() => {});
  const fetchCollections = () => axios.get(`${API}/api/products/collections`).then(r => setCollections(r.data)).catch(() => {});
  const fetchDiscounts = () => axios.get(`${API}/api/discounts`, { headers }).then(r => setDiscounts(r.data)).catch(() => {});
  const fetchOrders = () => {
    const params = statusFilter ? `?status=${statusFilter}` : '';
    axios.get(`${API}/api/orders/admin/all${params}`, { headers }).then(r => setOrders(r.data.orders)).catch(() => {});
  };

  useEffect(() => { fetchProducts(); fetchCategories(); fetchCollections(); fetchDiscounts(); }, []);
  useEffect(() => { fetchOrders(); }, [statusFilter]);

  // Product handlers
  const handleVariantChange = (i, field, value) => {
    const variants = [...productForm.variants];
    variants[i] = { ...variants[i], [field]: field === 'name' ? value : Number(value) };
    setProductForm({ ...productForm, variants });
  };
  const addVariant = () => setProductForm({ ...productForm, variants: [...productForm.variants, { name: '', price: 0, mrp: 0, stock: 0 }] });
  const removeVariant = (i) => setProductForm({ ...productForm, variants: productForm.variants.filter((_, idx) => idx !== i) });

  const submitProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      slug: productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      images: productForm.images ? productForm.images.split(',').map(s => s.trim()) : [],
      tags: productForm.tags ? productForm.tags.split(',').map(s => s.trim().toLowerCase()) : [],
    };
    try {
      if (editingId) {
        await axios.put(`${API}/api/products/${editingId}`, payload, { headers });
        toast.success('Product updated!');
      } else {
        await axios.post(`${API}/api/products`, payload, { headers });
        toast.success('Product created!');
      }
      setShowProductForm(false);
      setEditingId(null);
      setProductForm(emptyProduct);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const editProduct = (p) => {
    setEditingId(p._id);
    setProductForm({
      name: p.name, slug: p.slug, description: p.description,
      images: p.images?.join(', ') || '', category: p.category?._id || p.category || '',
      collection: p.collection?._id || p.collection || '', tags: p.tags?.join(', ') || '',
      variants: p.variants || [{ name: '', price: 0, mrp: 0, stock: 0 }],
    });
    setShowProductForm(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`${API}/api/products/${id}`, { headers });
    toast.success('Deleted');
    fetchProducts();
  };

  // Category handler
  const submitCategory = async (e) => {
    e.preventDefault();
    const payload = { ...categoryForm, slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
    try {
      await axios.post(`${API}/api/products/categories`, payload, { headers });
      toast.success('Category created!');
      setShowCategoryForm(false);
      setCategoryForm({ name: '', slug: '', icon: '', description: '' });
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Products using it may be affected.')) return;
    try {
      await axios.delete(`${API}/api/products/categories/${id}`, { headers });
      toast.success('Deleted');
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  // Collection handler
  const submitCollection = async (e) => {
    e.preventDefault();
    const payload = { ...collectionForm, slug: collectionForm.slug || collectionForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
    try {
      await axios.post(`${API}/api/products/collections`, payload, { headers });
      toast.success('Collection created!');
      setShowCollectionForm(false);
      setCollectionForm({ name: '', slug: '', description: '' });
      fetchCollections();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteCollection = async (id) => {
    if (!window.confirm('Delete this collection?')) return;
    try {
      await axios.delete(`${API}/api/products/collections/${id}`, { headers });
      toast.success('Deleted');
      fetchCollections();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  // Discount handler
  const submitDiscount = async (e) => {
    e.preventDefault();
    const payload = { ...discountForm, code: discountForm.code.toUpperCase() };
    try {
      if (editingId) {
        await axios.put(`${API}/api/discounts/${editingId}`, payload, { headers });
        toast.success('Discount updated!');
      } else {
        await axios.post(`${API}/api/discounts`, payload, { headers });
        toast.success('Discount created!');
      }
      setShowDiscountForm(false);
      setEditingId(null);
      setDiscountForm({ code: '', type: 'percentage', value: 0, minOrder: 0, maxDiscount: '', usageLimit: '', expiresAt: '' });
      fetchDiscounts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const editDiscount = (d) => {
    setEditingId(d._id);
    setDiscountForm({ code: d.code, type: d.type, value: d.value, minOrder: d.minOrder || 0, maxDiscount: d.maxDiscount || '', usageLimit: d.usageLimit || '', expiresAt: d.expiresAt ? d.expiresAt.slice(0, 10) : '' });
    setShowDiscountForm(true);
  };

  const deleteDiscount = async (id) => {
    if (!window.confirm('Delete this discount?')) return;
    await axios.delete(`${API}/api/discounts/${id}`, { headers });
    toast.success('Deleted');
    fetchDiscounts();
  };

  // Order handler
  const updateOrderStatus = async (id, orderStatus) => {
    try {
      await axios.patch(`${API}/api/orders/admin/${id}`, { orderStatus }, { headers });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed'); }
  };

  // Modal wrapper
  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">{title}</h2>
            <button onClick={onClose}><FiX size={24} className="dark:text-white" /></button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-dark-card shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
              <FiArrowLeft size={16} />
              Back to Site
            </Link>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-6 border-b dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== PRODUCTS TAB ===================== */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} products</p>
            <button onClick={() => { setShowProductForm(true); setEditingId(null); setProductForm(emptyProduct); }} className="btn-primary flex items-center gap-2 text-sm">
              <FiPlus /> Add Product
            </button>
          </div>

          <Modal show={showProductForm} onClose={() => setShowProductForm(false)} title={editingId ? 'Edit Product' : 'Add Product'}>
            <form onSubmit={submitProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required className="input-field" />
                <input placeholder="Slug (auto)" value={productForm.slug} onChange={e => setProductForm({ ...productForm, slug: e.target.value })} className="input-field" />
              </div>
              <textarea placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={2} className="input-field" />
              <input placeholder="Image URLs (comma separated)" value={productForm.images} onChange={e => setProductForm({ ...productForm, images: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-4">
                <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required className="input-field">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                </select>
                <select value={productForm.collection} onChange={e => setProductForm({ ...productForm, collection: e.target.value })} className="input-field">
                  <option value="">Select Collection</option>
                  {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <input placeholder="Tags (comma separated)" value={productForm.tags} onChange={e => setProductForm({ ...productForm, tags: e.target.value })} className="input-field" />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium dark:text-white">Variants</label>
                  <button type="button" onClick={addVariant} className="text-primary text-sm font-medium">+ Add Variant</button>
                </div>
                {productForm.variants.map((v, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input placeholder="Name" value={v.name} onChange={e => handleVariantChange(i, 'name', e.target.value)} className="input-field flex-1" required />
                    <input type="number" placeholder="Price" value={v.price || ''} onChange={e => handleVariantChange(i, 'price', e.target.value)} className="input-field w-20" required />
                    <input type="number" placeholder="MRP" value={v.mrp || ''} onChange={e => handleVariantChange(i, 'mrp', e.target.value)} className="input-field w-20" />
                    <input type="number" placeholder="Stock" value={v.stock || ''} onChange={e => handleVariantChange(i, 'stock', e.target.value)} className="input-field w-20" required />
                    {productForm.variants.length > 1 && <button type="button" onClick={() => removeVariant(i)} className="text-red-400 p-2"><FiTrash2 /></button>}
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-primary w-full">{editingId ? 'Update Product' : 'Create Product'}</button>
            </form>
          </Modal>

          <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left p-4 dark:text-gray-300">Product</th>
                    <th className="text-left p-4 dark:text-gray-300">Category</th>
                    <th className="text-left p-4 dark:text-gray-300">Price</th>
                    <th className="text-left p-4 dark:text-gray-300">Stock</th>
                    <th className="text-left p-4 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="border-t dark:border-gray-700">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover" />
                          <div>
                            <span className="font-medium dark:text-white block">{p.name}</span>
                            <span className="text-xs text-gray-400">{p.variants?.length} variants</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 dark:text-gray-300">{p.category?.icon} {p.category?.name || '-'}</td>
                      <td className="p-4 dark:text-gray-300">₹{p.variants?.length > 0 ? Math.min(...p.variants.map(v => v.price)) : '-'}</td>
                      <td className="p-4 dark:text-gray-300">{p.variants?.reduce((s, v) => s + v.stock, 0) || 0}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => editProduct(p)} className="text-blue-500 hover:text-blue-700"><FiEdit size={16} /></button>
                          <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-700"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <p className="text-center py-8 text-gray-400">No products yet</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===================== CATEGORIES TAB ===================== */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{categories.length} categories</p>
            <button onClick={() => setShowCategoryForm(true)} className="btn-primary flex items-center gap-2 text-sm">
              <FiPlus /> Add Category
            </button>
          </div>

          <Modal show={showCategoryForm} onClose={() => setShowCategoryForm(false)} title="Add Category">
            <form onSubmit={submitCategory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Category Name" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} required className="input-field" />
                <input placeholder="Slug (auto)" value={categoryForm.slug} onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })} className="input-field" />
              </div>
              <input placeholder="Icon (emoji, e.g. 🍎)" value={categoryForm.icon} onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })} className="input-field" />
              <textarea placeholder="Description" value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} rows={2} className="input-field" />
              <button type="submit" className="btn-primary w-full">Create Category</button>
            </form>
          </Modal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(c => (
              <div key={c._id} className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-medium dark:text-white">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.slug}</p>
                  </div>
                </div>
                <button onClick={() => deleteCategory(c._id)} className="text-red-400 hover:text-red-600 p-1"><FiTrash2 size={16} /></button>
              </div>
            ))}
          </div>
          {categories.length === 0 && <p className="text-center py-8 text-gray-400">No categories. Add one above.</p>}
        </div>
      )}

      {/* ===================== COLLECTIONS TAB ===================== */}
      {activeTab === 'collections' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{collections.length} collections</p>
            <button onClick={() => setShowCollectionForm(true)} className="btn-primary flex items-center gap-2 text-sm">
              <FiPlus /> Add Collection
            </button>
          </div>

          <Modal show={showCollectionForm} onClose={() => setShowCollectionForm(false)} title="Add Collection">
            <form onSubmit={submitCollection} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Collection Name" value={collectionForm.name} onChange={e => setCollectionForm({ ...collectionForm, name: e.target.value })} required className="input-field" />
                <input placeholder="Slug (auto)" value={collectionForm.slug} onChange={e => setCollectionForm({ ...collectionForm, slug: e.target.value })} className="input-field" />
              </div>
              <textarea placeholder="Description" value={collectionForm.description} onChange={e => setCollectionForm({ ...collectionForm, description: e.target.value })} rows={2} className="input-field" />
              <button type="submit" className="btn-primary w-full">Create Collection</button>
            </form>
          </Modal>

          <div className="space-y-3">
            {collections.map(c => (
              <div key={c._id} className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-medium dark:text-white">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.slug} {c.active ? '' : '(inactive)'}</p>
                  {c.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.description}</p>}
                </div>
                <button onClick={() => deleteCollection(c._id)} className="text-red-400 hover:text-red-600 p-1"><FiTrash2 size={16} /></button>
              </div>
            ))}
          </div>
          {collections.length === 0 && <p className="text-center py-8 text-gray-400">No collections. Add one above.</p>}
        </div>
      )}

      {/* ===================== DISCOUNTS TAB ===================== */}
      {activeTab === 'discounts' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{discounts.length} coupons</p>
            <button onClick={() => { setShowDiscountForm(true); setEditingId(null); setDiscountForm({ code: '', type: 'percentage', value: 0, minOrder: 0, maxDiscount: '', usageLimit: '', expiresAt: '' }); }} className="btn-primary flex items-center gap-2 text-sm">
              <FiPlus /> Add Discount
            </button>
          </div>

          <Modal show={showDiscountForm} onClose={() => setShowDiscountForm(false)} title={editingId ? 'Edit Discount' : 'Add Discount'}>
            <form onSubmit={submitDiscount} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Coupon Code" value={discountForm.code} onChange={e => setDiscountForm({ ...discountForm, code: e.target.value })} required className="input-field" />
                <select value={discountForm.type} onChange={e => setDiscountForm({ ...discountForm, type: e.target.value })} className="input-field">
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Value" value={discountForm.value || ''} onChange={e => setDiscountForm({ ...discountForm, value: Number(e.target.value) })} required className="input-field" />
                <input type="number" placeholder="Min Order (₹)" value={discountForm.minOrder || ''} onChange={e => setDiscountForm({ ...discountForm, minOrder: Number(e.target.value) })} className="input-field" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input type="number" placeholder="Max Discount (₹)" value={discountForm.maxDiscount} onChange={e => setDiscountForm({ ...discountForm, maxDiscount: e.target.value })} className="input-field" />
                <input type="number" placeholder="Usage Limit" value={discountForm.usageLimit} onChange={e => setDiscountForm({ ...discountForm, usageLimit: e.target.value })} className="input-field" />
                <input type="date" value={discountForm.expiresAt} onChange={e => setDiscountForm({ ...discountForm, expiresAt: e.target.value })} className="input-field" />
              </div>
              <button type="submit" className="btn-primary w-full">{editingId ? 'Update Discount' : 'Create Discount'}</button>
            </form>
          </Modal>

          <div className="space-y-3">
            {discounts.map(d => {
              const expired = d.expiresAt && new Date(d.expiresAt) < new Date();
              return (
                <div key={d._id} className={`bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border-l-4 ${expired ? 'border-red-400 opacity-60' : d.active ? 'border-green-400' : 'border-gray-300'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiTag size={14} className="text-primary" />
                        <span className="font-bold dark:text-white">{d.code}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {d.type === 'percentage' ? `${d.value}%` : `₹${d.value}`}
                        </span>
                        {expired && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Expired</span>}
                        {!d.active && !expired && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">Inactive</span>}
                      </div>
                      <p className="text-xs text-gray-400">
                        {d.minOrder > 0 && `Min ₹${d.minOrder} • `}
                        {d.maxDiscount && `Max ₹${d.maxDiscount} • `}
                        {d.usageLimit ? `${d.usedCount}/${d.usageLimit} used` : `${d.usedCount} used`}
                        {d.expiresAt && ` • Expires ${new Date(d.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editDiscount(d)} className="text-blue-500 hover:text-blue-700 p-1"><FiEdit size={16} /></button>
                      <button onClick={() => deleteDiscount(d._id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {discounts.length === 0 && <p className="text-center py-8 text-gray-400">No discounts. Create one above.</p>}
        </div>
      )}

      {/* ===================== ORDERS TAB ===================== */}
      {activeTab === 'orders' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{orders.length} orders</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
            <button onClick={() => setStatusFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${!statusFilter ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-card dark:text-gray-300'}`}>All</button>
            {statuses.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${statusFilter === s ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-card dark:text-gray-300'}`}>{s}</button>
            ))}
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div key={order._id} className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden">
                <div
                  className="flex flex-wrap items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div>
                    <p className="font-bold dark:text-white">{order.orderId}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.user?.name || 'Customer'} &middot; {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                    <span className="font-bold dark:text-white">₹{order.totalAmount}</span>
                    {expandedOrder === order._id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="px-4 pb-4 border-t dark:border-gray-700">
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-1 uppercase">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <img src={item.image || 'https://via.placeholder.com/32'} alt="" className="w-8 h-8 rounded object-cover" />
                              <span className="text-sm dark:text-white">{item.name} ({item.variant}) x{item.qty}</span>
                              <span className="text-sm text-gray-400 ml-auto">₹{item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-1 uppercase">Shipping</p>
                        <p className="text-sm dark:text-white">{order.shippingAddress?.name}</p>
                        <p className="text-sm text-gray-400">{order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
                        <p className="text-sm text-gray-400">{order.shippingAddress?.phone}</p>
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-400 mb-1 uppercase">Payment</p>
                          <span className={`text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {order.paymentStatus?.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-400 mb-1 uppercase">Update Status</p>
                          <select
                            value={order.orderStatus}
                            onChange={e => updateOrderStatus(order._id, e.target.value)}
                            className="text-sm border rounded-lg px-3 py-1.5 dark:bg-dark-bg dark:border-gray-600 dark:text-white"
                          >
                            {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {orders.length === 0 && <p className="text-center py-8 text-gray-400">No orders found</p>}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
