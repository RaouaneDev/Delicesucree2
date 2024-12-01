import { db } from './config';
import { 
  collection, 
  getDocs, 
  query, 
  where
} from 'firebase/firestore';

// Récupérer toutes les catégories
export const getAllCategories = async () => {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
};

// Récupérer une catégorie par son ID
export const getCategoryById = async (categoryId) => {
  try {
    const categoriesSnapshot = await getDocs(
      query(collection(db, 'categories'), where('id', '==', categoryId))
    );
    
    if (categoriesSnapshot.empty) {
      return null;
    }

    const categoryDoc = categoriesSnapshot.docs[0];
    return {
      id: categoryDoc.id,
      ...categoryDoc.data()
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    throw error;
  }
};
