import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { categories } from '../data/categories';

const COLLECTION_NAME = 'products';

// Fonction pour obtenir une catégorie et sous-catégorie aléatoire
const getRandomCategory = () => {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomSubcategory = randomCategory.subcategories[
    Math.floor(Math.random() * randomCategory.subcategories.length)
  ];
  
  return {
    categoryId: randomCategory.id,
    categoryName: randomCategory.name,
    subcategoryId: randomSubcategory.id,
    subcategoryName: randomSubcategory.name
  };
};

// Fonction principale pour mettre à jour les produits
const updateProductCategories = async () => {
  try {
    console.log('Début de la mise à jour des catégories...');
    
    // Récupérer tous les produits
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const updatePromises = [];
    
    // Pour chaque produit
    querySnapshot.docs.forEach(docSnapshot => {
      const { categoryId, categoryName, subcategoryId, subcategoryName } = getRandomCategory();
      
      // Créer la promesse de mise à jour
      const updatePromise = updateDoc(doc(db, COLLECTION_NAME, docSnapshot.id), {
        category: categoryId,
        categoryName: categoryName,
        subcategory: subcategoryId,
        subcategoryName: subcategoryName,
        updatedAt: new Date().toISOString()
      });
      
      updatePromises.push(updatePromise);
    });
    
    // Attendre que toutes les mises à jour soient terminées
    await Promise.all(updatePromises);
    
    console.log(`Mise à jour terminée ! ${updatePromises.length} produits ont été mis à jour.`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des catégories:', error);
  }
};

// Exécuter la mise à jour
updateProductCategories();
