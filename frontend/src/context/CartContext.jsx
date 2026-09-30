import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pasalx_cart")) || []; }
    catch { return []; }
  });

  useEffect(() => localStorage.setItem("pasalx_cart", JSON.stringify(items)), [items]);

  function addToCart(product, quantity = 1) {
    setItems(current => {
      const found = current.find(x => x.product._id === product._id);
      if (found) return current.map(x => x.product._id === product._id
        ? { ...x, quantity: x.quantity + quantity } : x);
      return [...current, { product, quantity }];
    });
  }

  function updateQuantity(id, quantity) {
    setItems(current => quantity <= 0
      ? current.filter(x => x.product._id !== id)
      : current.map(x => x.product._id === id ? { ...x, quantity } : x));
  }

  function removeFromCart(id) {
    setItems(current => current.filter(x => x.product._id !== id));
  }

  function clearCart() { setItems([]); }

  const subtotal = useMemo(() => items.reduce(
    (sum, x) => sum + Number(x.product.productPrice || 0) * x.quantity, 0
  ), [items]);

  const count = useMemo(() => items.reduce((sum, x) => sum + x.quantity, 0), [items]);

  return <CartContext.Provider value={{
    items, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, count
  }}>
    {children}
  </CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }