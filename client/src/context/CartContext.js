import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const MAX_QTY = 5;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (product, variant, qty = 1) => {
    setItems(prev => {
      const key = `${product._id}-${variant.name}`;
      const existing = prev.find(i => i.key === key);
      let updated;
      if (existing) {
        const newQty = Math.min(existing.qty + qty, MAX_QTY);
        updated = prev.map(i => i.key === key ? { ...i, qty: newQty } : i);
      } else {
        updated = [...prev, {
          key,
          product,
          variant,
          qty: Math.min(qty, MAX_QTY),
        }];
      }
      // Auto-open cart sidebar after 1 second
      setTimeout(() => {
        setIsCartOpen(true);
      }, 1000);
      return updated;
    });
  };

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key));

  const updateQty = (key, qty) => {
    if (qty < 1) return removeItem(key);
    if (qty > MAX_QTY) qty = MAX_QTY;
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.variant.price * i.qty, 0);
  const shipping = subtotal >= 300 ? 0 : (subtotal > 0 ? 85 : 0);
  const total = subtotal + shipping;
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart, subtotal, shipping, total, count,
      isOpen: isCartOpen, openCart, closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
