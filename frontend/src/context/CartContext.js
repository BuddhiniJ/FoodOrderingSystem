// 🛒 CartContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = ({ menuId, name, price, quantity, instructions, restaurant }) => {
    const updatedCart = [...cart];
  
    const existing = updatedCart.find(item => item.menuId === menuId);
    if (existing) {
      existing.quantity += quantity;
      existing.instructions = instructions;
    } else {
      updatedCart.push({
        menuId,
        name,
        price,
        quantity,
        instructions,
        restaurant  // ✅ Add this
      });
    }
  
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  

  const removeFromCart = (menuId) => {
    setCart(prev => prev.filter(item => item.menuId !== menuId));
  };

  const clearCart = () => setCart([]);

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};
