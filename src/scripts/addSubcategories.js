const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

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

// Nouvelles sous-catégories à ajouter pour chaque catégorie principale
const newSubcategories = {
  'gateaux': [
    {
      id: 'birthday-cakes',
      name: 'Gâteaux d\'Anniversaire',
      description: 'Gâteaux personnalisés pour vos célébrations',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&h=600&q=80'
    },
    {
      id: 'fruit-cakes',
      name: 'Gâteaux aux Fruits',
      description: 'Gâteaux garnis de fruits frais',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&h=600&q=80'
    },
    {
      id: 'chocolate-cakes',
      name: 'Gâteaux au Chocolat',
      description: 'Pour les amoureux du chocolat',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&h=600&q=80'
    }
  ],
  'patisseries': [
    {
      id: 'choux',
      name: 'Choux à la Crème',
      description: 'Délicieux choux garnis de crème',
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&h=600&q=80'
    },
    {
      id: 'millefeuilles',
      name: 'Millefeuilles',
      description: 'Pâte feuilletée et crème pâtissière',
      image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=800&h=600&q=80'
    },
    {
      id: 'religieuses',
      name: 'Religieuses',
      description: 'Choux superposés et glacés',
      image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&h=600&q=80'
    }
  ],
  'viennoiseries': [
    {
      id: 'pains-raisins',
      name: 'Pains aux Raisins',
      description: 'Viennoiseries aux raisins et à la crème pâtissière',
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&h=600&q=80'
    },
    {
      id: 'chaussons-pommes',
      name: 'Chaussons aux Pommes',
      description: 'Feuilletés aux pommes caramélisées',
      image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?auto=format&fit=crop&w=800&h=600&q=80'
    },
    {
      id: 'palmiers',
      name: 'Palmiers',
      description: 'Délicieux feuilletés en forme de cœur',
      image: 'https://images.unsplash.com/photo-1558305336-06e7c5f9f0b9?auto=format&fit=crop&w=800&h=600&q=80'
    }
  ],
  'specialites': [
    {
      id: 'croquembouches',
      name: 'Croquembouches',
      description: 'Tours de choux caramélisés',
      image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&h=600&q=80'
    },
    {
      id: 'macarons-luxe',
      name: 'Macarons de Luxe',
      description: 'Macarons aux saveurs exclusives',
      image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&h=600&q=80'
    },
    {
      id: 'entremets',
      name: 'Entremets',
      description: 'Gâteaux multicouches raffinés',
      image: 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?auto=format&fit=crop&w=800&h=600&q=80'
    }
  ]
};

const updateSubcategories = async () => {
  try {
    console.log('Début de la mise à jour des sous-catégories...');

    // Récupérer toutes les catégories
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));

    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      const categoryId = categoryData.id;

      if (newSubcategories[categoryId]) {
        // Fusionner les sous-catégories existantes avec les nouvelles
        const existingSubcategories = categoryData.subcategories || [];
        const updatedSubcategories = [
          ...existingSubcategories,
          ...newSubcategories[categoryId]
        ];

        // Mettre à jour le document avec les nouvelles sous-catégories
        await updateDoc(doc(db, 'categories', categoryDoc.id), {
          subcategories: updatedSubcategories,
          updatedAt: new Date().toISOString()
        });

        console.log(`Sous-catégories ajoutées pour: ${categoryData.name}`);
      }
    }

    console.log('Toutes les sous-catégories ont été ajoutées avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des sous-catégories:', error);
  }
};

// Exécuter la mise à jour des sous-catégories
updateSubcategories();
