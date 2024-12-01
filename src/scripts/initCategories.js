// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

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

const categories = [
  {
    id: 'gateaux',
    name: 'Gâteaux',
    description: 'Nos délicieux gâteaux pour toutes les occasions',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&h=600&q=80',
    subcategories: [
      {
        id: 'number-cakes',
        name: 'Number Cakes',
        description: 'Gâteaux en forme de chiffres',
        image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&h=600&q=80'
      },
      {
        id: 'layer-cakes',
        name: 'Layer Cakes',
        description: 'Gâteaux à étages',
        image: 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?auto=format&fit=crop&w=800&h=600&q=80'
      },
      {
        id: 'wedding-cakes',
        name: 'Gâteaux de Mariage',
        description: 'Gâteaux pour votre jour spécial',
        image: 'https://images.unsplash.com/photo-1623428454614-abaf00244e52?auto=format&fit=crop&w=800&h=600&q=80'
      }
    ]
  },
  {
    id: 'patisseries',
    name: 'Pâtisseries',
    description: 'Nos pâtisseries fines et traditionnelles',
    image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&w=800&h=600&q=80',
    subcategories: [
      {
        id: 'macarons',
        name: 'Macarons',
        description: 'Macarons aux saveurs variées',
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&h=600&q=80'
      },
      {
        id: 'eclairs',
        name: 'Éclairs',
        description: 'Éclairs gourmands',
        image: 'https://images.unsplash.com/photo-1628355095728-90b3de844dff?auto=format&fit=crop&w=800&h=600&q=80'
      },
      {
        id: 'tartes',
        name: 'Tartes',
        description: 'Tartes aux fruits et autres saveurs',
        image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&h=600&q=80'
      }
    ]
  },
  {
    id: 'viennoiseries',
    name: 'Viennoiseries',
    description: 'Nos viennoiseries fraîches et croustillantes',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&h=600&q=80',
    subcategories: [
      {
        id: 'croissants',
        name: 'Croissants',
        description: 'Croissants au beurre',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&h=600&q=80'
      },
      {
        id: 'pains-chocolat',
        name: 'Pains au Chocolat',
        description: 'Pains au chocolat croustillants',
        image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&h=600&q=80'
      },
      {
        id: 'brioches',
        name: 'Brioches',
        description: 'Brioches moelleuses',
        image: 'https://images.unsplash.com/photo-1620921575116-fb8902eef959?auto=format&fit=crop&w=800&h=600&q=80'
      }
    ]
  },
  {
    id: 'specialites',
    name: 'Spécialités',
    description: 'Nos créations spéciales et saisonnières',
    image: 'https://images.unsplash.com/photo-1505976378723-9726b54e9bb9?auto=format&fit=crop&w=800&h=600&q=80',
    subcategories: [
      {
        id: 'buches',
        name: 'Bûches de Noël',
        description: 'Bûches traditionnelles et modernes',
        image: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?auto=format&fit=crop&w=800&h=600&q=80'
      },
      {
        id: 'galettes',
        name: 'Galettes des Rois',
        description: 'Galettes pour l\'Épiphanie',
        image: 'https://images.unsplash.com/photo-1610653216265-74079d4c8f63?auto=format&fit=crop&w=800&h=600&q=80'
      },
      {
        id: 'pieces-montees',
        name: 'Pièces Montées',
        description: 'Pièces montées pour événements',
        image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&h=600&q=80'
      }
    ]
  }
];

const initializeCategories = async () => {
  try {
    console.log('Début de l\'initialisation des catégories...');

    // Vérifier si des catégories existent déjà
    const existingCategoriesSnapshot = await getDocs(collection(db, 'categories'));
    if (!existingCategoriesSnapshot.empty) {
      console.log('Les catégories existent déjà dans la base de données.');
      return;
    }

    // Ajouter chaque catégorie
    for (const category of categories) {
      const categoryData = {
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        subcategories: category.subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          image: sub.image
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      console.log(`Catégorie ajoutée: ${category.name} avec l'ID: ${docRef.id}`);
    }

    console.log('Initialisation des catégories terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des catégories:', error);
  }
};

// Exécuter l'initialisation
initializeCategories();
