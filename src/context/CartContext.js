import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext({
  cartItems: [],
  addItem: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => '0.00',
  getCartItemsCount: () => 0,
  deliveryDateTime: null,
  updateDeliveryDateTime: () => {},
  customerInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
  },
  updateCustomerInfo: () => {},
  isCustomerInfoComplete: () => false
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryDateTime, setDeliveryDateTime] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
  });

  const addItem = (item) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        i => i.id === item.id && i.customMessage === item.customMessage
      );

      if (existingItemIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => {
      return prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace('€', '').replace(',', '.'))
        : parseFloat(item.price);
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const updateDeliveryDateTime = (datetime) => {
    setDeliveryDateTime(datetime);
  };

  const updateCustomerInfo = (info) => {
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      ...info
    }));
  };

  const isCustomerInfoComplete = () => {
    return Object.values(customerInfo).every(value => value.trim() !== '');
  };

  const value = {
    cartItems,
    addItem,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getCartItemsCount,
    deliveryDateTime,
    updateDeliveryDateTime,
    customerInfo,
    updateCustomerInfo,
    isCustomerInfoComplete
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
