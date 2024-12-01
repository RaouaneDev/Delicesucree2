const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2BZHJoNCpRFWz1_F5LuB_WQzHNOzVgGg",
  authDomain: "patisserie1-efe23.firebaseapp.com",
  projectId: "patisserie1-efe23",
  storageBucket: "patisserie1-efe23.appspot.com",
  messagingSenderId: "1048255582661",
  appId: "1:1048255582661:web:9dd0c40d7cd89f56f4a2ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Produits par sous-catégorie
const products = {
  // Gâteaux
  'birthday-cakes': [
    {
      name: 'Gâteau Arc-en-ciel',
      description: 'Gâteau coloré à 6 couches avec glaçage à la vanille',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Farine', 'Œufs', 'Sucre', 'Colorants naturels', 'Crème au beurre'],
      allergens: ['Gluten', 'Œufs', 'Lait'],
      available: true,
      preparationTime: '48h',
      size: '8-10 parts'
    },
    {
      name: 'Gâteau Licorne',
      description: 'Gâteau fantaisie décoré avec une corne et des couleurs pastels',
      price: 55.00,
      image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Farine', 'Œufs', 'Sucre', 'Pâte à sucre', 'Crème au beurre'],
      allergens: ['Gluten', 'Œufs', 'Lait'],
      available: true,
      preparationTime: '72h',
      size: '12-15 parts'
    }
  ],
  'chocolate-cakes': [
    {
      name: 'Forêt Noire',
      description: 'Gâteau au chocolat avec cerises et crème chantilly',
      price: 40.00,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Chocolat noir', 'Cerises', 'Crème', 'Kirsch', 'Cacao'],
      allergens: ['Gluten', 'Œufs', 'Lait'],
      available: true,
      preparationTime: '24h',
      size: '8-10 parts'
    }
  ],

  // Pâtisseries
  'choux': [
    {
      name: 'Éclair au Chocolat',
      description: 'Pâte à choux garnie de crème pâtissière au chocolat',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Pâte à choux', 'Crème pâtissière', 'Chocolat'],
      allergens: ['Gluten', 'Œufs', 'Lait'],
      available: true,
      preparationTime: '24h',
      size: '1 part'
    },
    {
      name: 'Paris-Brest',
      description: 'Couronne de pâte à choux garnie de crème pralinée',
      price: 5.50,
      image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Pâte à choux', 'Crème pralinée', 'Amandes effilées'],
      allergens: ['Gluten', 'Œufs', 'Lait', 'Fruits à coque'],
      available: true,
      preparationTime: '24h',
      size: '1 part'
    }
  ],

  // Viennoiseries
  'croissants': [
    {
      name: 'Croissant au Beurre',
      description: 'Croissant pur beurre traditionnel',
      price: 2.00,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Farine', 'Beurre AOP', 'Levure'],
      allergens: ['Gluten', 'Lait'],
      available: true,
      preparationTime: '24h',
      size: '1 part'
    }
  ],
  'pains-chocolat': [
    {
      name: 'Pain au Chocolat',
      description: 'Viennoiserie au beurre avec deux barres de chocolat',
      price: 2.20,
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Farine', 'Beurre AOP', 'Chocolat noir', 'Levure'],
      allergens: ['Gluten', 'Lait', 'Soja'],
      available: true,
      preparationTime: '24h',
      size: '1 part'
    }
  ],

  // Spécialités
  'macarons-luxe': [
    {
      name: 'Coffret Macarons Prestige',
      description: 'Assortiment de 12 macarons aux saveurs raffinées',
      price: 28.00,
      image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Amandes', 'Sucre', 'Blancs d\'œufs', 'Ganaches variées'],
      allergens: ['Œufs', 'Fruits à coque', 'Lait'],
      available: true,
      preparationTime: '48h',
      size: '12 pièces'
    }
  ],
  'entremets': [
    {
      name: 'Royal Chocolat',
      description: 'Entremet au chocolat avec croustillant praliné',
      price: 35.00,
      image: 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?auto=format&fit=crop&w=800&h=600&q=80',
      ingredients: ['Chocolat noir', 'Praliné', 'Crème', 'Biscuit'],
      allergens: ['Gluten', 'Œufs', 'Lait', 'Fruits à coque'],
      available: true,
      preparationTime: '48h',
      size: '6-8 parts'
    }
  ]
};

const addProducts = async () => {
  try {
    console.log('Début de l\'ajout des produits...');

    // Récupérer toutes les catégories
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categories = {};
    
    categoriesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      categories[data.id] = data;
    });

    for (const [subcategoryId, productsList] of Object.entries(products)) {
      for (const product of productsList) {
        // Trouver la catégorie parente
        let parentCategory = null;
        let subcategory = null;

        for (const category of Object.values(categories)) {
          const foundSubcategory = category.subcategories.find(sub => sub.id === subcategoryId);
          if (foundSubcategory) {
            parentCategory = category;
            subcategory = foundSubcategory;
            break;
          }
        }

        if (parentCategory && subcategory) {
          const productData = {
            ...product,
            categoryId: parentCategory.id,
            categoryName: parentCategory.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const docRef = await addDoc(collection(db, 'products'), productData);
          console.log(`Produit ajouté: ${product.name} (${subcategory.name}) avec l'ID: ${docRef.id}`);
        }
      }
    }

    console.log('Tous les produits ont été ajoutés avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des produits:', error);
  }
};

// Exécuter l'ajout des produits
addProducts();
