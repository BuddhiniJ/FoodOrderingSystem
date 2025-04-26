import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  cart: []
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        cart: state.cart.filter((_, idx) => idx !== action.payload)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeFromCart = (index) => dispatch({ type: 'REMOVE_ITEM', payload: index });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getTotal = () =>
    state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const groupedByRestaurant = () => {
    return state.cart.reduce((acc, item) => {
      const rid = item.restaurantId;
      if (!acc[rid]) {
        acc[rid] = {
          restaurantName: item.restaurantName,
          items: []
        };
      }
      acc[rid].items.push(item);
      return acc;
    }, {});
  };

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      addToCart,
      removeFromCart,
      clearCart,
      getTotal,
      groupedByRestaurant
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => useContext(CartContext);
