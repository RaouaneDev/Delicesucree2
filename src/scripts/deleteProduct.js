const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { deleteProduct } = require('../firebase/productService');
const { firebaseConfig } = require('../firebase/config');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteNumberCake() {
  try {
    await deleteProduct('202');
    console.log('Produit supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
}

deleteNumberCake();
