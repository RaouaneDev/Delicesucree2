const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore');

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

// Fonction pour générer un prix aléatoire entre min et max
const randomPrice = (min, max) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

// Fonction pour sélectionner aléatoirement des éléments d'un tableau
const randomItems = (array, count) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Ingrédients possibles
const ingredients = [
  'Farine', 'Sucre', 'Œufs', 'Lait', 'Beurre', 'Crème', 'Chocolat noir', 
  'Chocolat au lait', 'Chocolat blanc', 'Amandes', 'Noisettes', 'Vanille', 
  'Levure', 'Sel', 'Fruits rouges', 'Fraises', 'Framboises', 'Myrtilles',
  'Pistaches', 'Noix de coco', 'Caramel', 'Praliné', 'Café', 'Citron',
  'Orange', 'Pommes', 'Poires', 'Pâte d\'amande', 'Crème pâtissière'
];

// Allergènes possibles
const allergens = [
  'Gluten', 'Œufs', 'Lait', 'Fruits à coque', 'Soja', 'Arachides',
  'Fruits à coques', 'Sulfites'
];

// Tailles possibles
const sizes = [
  '1 part', '4-6 parts', '6-8 parts', '8-10 parts', '10-12 parts',
  '12-15 parts', 'Mini (25g)', 'Standard (50g)', 'Grande (75g)'
];

// Produits par sous-catégorie
const productTemplates = {
  // Gâteaux
  'number-cakes': [
    {
      name: 'Number Cake 30',
      description: 'Gâteau en forme de chiffre 30 garni de macarons et fruits rouges',
      basePrice: 45
    },
    {
      name: 'Number Cake Chocolat',
      description: 'Gâteau en forme de chiffre décoré de chocolat et fruits secs',
      basePrice: 40
    }
  ],
  'layer-cakes': [
    {
      name: 'Layer Cake Rainbow',
      description: 'Gâteau multicouches aux couleurs de l\'arc-en-ciel',
      basePrice: 50
    },
    {
      name: 'Layer Cake Fruits Rouges',
      description: 'Gâteau multicouches aux fruits rouges frais',
      basePrice: 45
    }
  ],
  'wedding-cakes': [
    {
      name: 'Wedding Cake Classique',
      description: 'Gâteau de mariage à trois étages avec décoration florale',
      basePrice: 150
    },
    {
      name: 'Wedding Cake Modern',
      description: 'Gâteau de mariage design avec finition géométrique',
      basePrice: 180
    }
  ],
  // Pâtisseries
  'macarons': [
    {
      name: 'Macarons Assortis',
      description: 'Assortiment de macarons aux saveurs variées',
      basePrice: 18
    },
    {
      name: 'Macarons Prestige',
      description: 'Coffret de macarons aux saveurs raffinées',
      basePrice: 24
    }
  ],
  'eclairs': [
    {
      name: 'Éclair Chocolat',
      description: 'Éclair garni de crème pâtissière au chocolat',
      basePrice: 4
    },
    {
      name: 'Éclair Café',
      description: 'Éclair garni de crème pâtissière au café',
      basePrice: 4
    }
  ],
  'tartes': [
    {
      name: 'Tarte aux Fruits',
      description: 'Tarte garnie de fruits frais de saison',
      basePrice: 25
    },
    {
      name: 'Tarte au Citron Meringuée',
      description: 'Tarte au citron recouverte de meringue italienne',
      basePrice: 28
    }
  ],
  // Viennoiseries
  'croissants': [
    {
      name: 'Croissant Pur Beurre',
      description: 'Croissant traditionnel au beurre AOP',
      basePrice: 2
    },
    {
      name: 'Croissant aux Amandes',
      description: 'Croissant fourré à la crème d\'amandes',
      basePrice: 2.5
    }
  ],
  'pains-chocolat': [
    {
      name: 'Pain au Chocolat',
      description: 'Pain au chocolat pur beurre',
      basePrice: 2
    },
    {
      name: 'Pain au Chocolat-Noisettes',
      description: 'Pain au chocolat avec éclats de noisettes',
      basePrice: 2.5
    }
  ],
  'brioches': [
    {
      name: 'Brioche Parisienne',
      description: 'Brioche moelleuse nature',
      basePrice: 3
    },
    {
      name: 'Brioche aux Pépites',
      description: 'Brioche aux pépites de chocolat',
      basePrice: 3.5
    }
  ]
};

// Images par catégorie
const categoryImages = {
  'gateaux': [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    'https://images.unsplash.com/photo-1535141192574-5d4897c12636',
    'https://images.unsplash.com/photo-1557979619-445218f326b9',
    'https://images.unsplash.com/photo-1562777717-dc6984f65a63'
  ],
  'patisseries': [
    'https://images.unsplash.com/photo-1612203985729-70726954388c',
    'https://images.unsplash.com/photo-1509365465985-25d11c17e812',
    'https://images.unsplash.com/photo-1519915028121-7d3463d20b13',
    'https://images.unsplash.com/photo-1505976378723-9726b54e9bb9'
  ],
  'viennoiseries': [
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    'https://images.unsplash.com/photo-1608198093002-ad4e005484ec',
    'https://images.unsplash.com/photo-1620921575116-fb8902eef959',
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df'
  ]
};

const addRandomProducts = async () => {
  try {
    console.log('Début de l\'ajout des produits aléatoires...');

    // Récupérer toutes les catégories
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categories = {};
    
    categoriesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      categories[data.id] = data;
    });

    for (const [subcategoryId, templates] of Object.entries(productTemplates)) {
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
        // Ajouter 2-4 produits par sous-catégorie
        const numProducts = Math.floor(Math.random() * 3) + 2;

        for (let i = 0; i < numProducts; i++) {
          const template = templates[Math.floor(Math.random() * templates.length)];
          const priceVariation = Math.random() * 10 - 5; // -5 à +5
          const images = categoryImages[parentCategory.id] || [];
          
          const productData = {
            name: `${template.name} ${i + 1}`,
            description: template.description,
            price: (template.basePrice + priceVariation).toFixed(2),
            image: `${images[Math.floor(Math.random() * images.length)]}?auto=format&fit=crop&w=800&h=600&q=80`,
            ingredients: randomItems(ingredients, Math.floor(Math.random() * 5) + 3),
            allergens: randomItems(allergens, Math.floor(Math.random() * 3) + 1),
            available: Math.random() > 0.1, // 90% de chance d'être disponible
            preparationTime: Math.random() > 0.5 ? '24h' : '48h',
            size: sizes[Math.floor(Math.random() * sizes.length)],
            categoryId: parentCategory.id,
            categoryName: parentCategory.name,
            subcategoryId: subcategory.id,
            subcategoryName: subcategory.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const docRef = await addDoc(collection(db, 'products'), productData);
          console.log(`Produit ajouté: ${productData.name} (${subcategory.name}) avec l'ID: ${docRef.id}`);
        }
      }
    }

    console.log('Tous les produits aléatoires ont été ajoutés avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des produits:', error);
  }
};

// Exécuter l'ajout des produits
addRandomProducts();
