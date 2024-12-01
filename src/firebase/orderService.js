import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from './config';

// Créer une nouvelle commande
export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId, newStatus, notes = '') => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    await updateDoc(orderRef, {
      status: newStatus,
      notes: notes,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      message: `Order status updated to ${newStatus}`
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Récupérer toutes les commandes
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// Récupérer les commandes par statut
export const getOrdersByStatus = async (status) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error getting orders by status:', error);
    throw error;
  }
};

// Récupérer une commande par ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    const data = orderDoc.data();
    return {
      id: orderDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

// Récupérer les commandes d'un utilisateur
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Ajouter des notes à une commande
export const addOrderNotes = async (orderId, notes) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      notes: notes,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      message: 'Notes added successfully'
    };
  } catch (error) {
    console.error('Error adding notes to order:', error);
    throw error;
  }
};
