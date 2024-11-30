import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
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
    setItems(prevItems => {
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

  const removeFromCart = (index) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = {
        ...newItems[index],
        quantity: newQuantity
      };
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const getCartItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
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

  return (
    <CartContext.Provider value={{
      items,
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
    }}>
      {children}
    </CartContext.Provider>
  );
};
