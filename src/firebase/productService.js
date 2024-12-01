import { db } from './config';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// Récupérer les produits par catégorie et sous-catégorie
export const getProductsByCategory = async (categoryId, subcategoryId = null) => {
  try {
    let q = query(
      collection(db, 'products'),
      where('categoryId', '==', categoryId)
    );

    if (subcategoryId) {
      q = query(
        collection(db, 'products'),
        where('categoryId', '==', categoryId),
        where('subcategoryId', '==', subcategoryId)
      );
    }

    const productsSnapshot = await getDocs(q);
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};

// Récupérer tous les produits
export const getAllProducts = async () => {
  try {
    const productsSnapshot = await getDocs(
      query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    );
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};

// Ajouter un nouveau produit
export const addProduct = async (productData) => {
  try {
    const newProduct = {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'products'), newProduct);
    return {
      id: docRef.id,
      ...newProduct
    };
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error);
    throw error;
  }
};

// Mettre à jour un produit existant
export const updateProduct = async (productId, productData) => {
  try {
    const updatedProduct = {
      ...productData,
      updatedAt: new Date().toISOString()
    };

    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updatedProduct);

    return {
      id: productId,
      ...updatedProduct
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    throw error;
  }
};

// Supprimer un produit
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return productId;
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    throw error;
  }
};
