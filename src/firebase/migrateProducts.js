import { addProduct } from './productService';

const products = [
  {
    name: 'Éclair au Chocolat',
    price: '3.50',
    description: 'Pâte à choux croustillante garnie d\'une onctueuse crème pâtissière au chocolat noir',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
    category: 'classiques',
    inStock: true
  },
  {
    name: 'Mille-feuille Vanille',
    price: '4.50',
    description: 'Trois couches de pâte feuilletée croustillante et deux couches de crème pâtissière à la vanille de Madagascar',
    image: 'https://images.unsplash.com/photo-1620980776848-84ac10194945?auto=format&fit=crop&w=800&q=80',
    category: 'classiques',
    inStock: true
  },
  {
    name: 'Tarte aux Fraises',
    price: '4.00',
    description: 'Pâte sablée, crème d\'amande, crème pâtissière et fraises fraîches de saison',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    category: 'anniversaires',
    inStock: true
  },
  {
    name: 'Macaron Assortiment',
    price: '12.00',
    description: 'Coffret de 6 macarons : vanille, chocolat, framboise, pistache, caramel, citron',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
    category: 'cocktails',
    inStock: true
  },
  {
    name: 'Paris-Brest',
    price: '4.50',
    description: 'Couronne de pâte à choux garnie d\'une crème pralinée aux noisettes',
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80',
    category: 'classiques',
    inStock: true
  },
  {
    name: 'Opéra',
    price: '5.00',
    description: 'Biscuit joconde, crème au beurre café, ganache chocolat',
    image: 'https://images.unsplash.com/photo-1551404973-761c83cd8339?auto=format&fit=crop&w=800&q=80',
    category: 'mariages',
    inStock: true
  },
  {
    name: 'Croissant aux Amandes',
    price: '2.80',
    description: 'Croissant feuilleté garni de crème d\'amandes et amandes effilées',
    image: 'https://images.unsplash.com/photo-1509983165097-0c31a863e3f3?auto=format&fit=crop&w=800&q=80',
    category: 'classiques',
    inStock: true
  },
  {
    name: 'Tarte au Citron Meringuée',
    price: '4.00',
    description: 'Pâte sablée, crème au citron et meringue italienne',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
    category: 'classiques',
    inStock: true
  },
  {
    name: 'Forêt Noire',
    price: '4.50',
    description: 'Génoise au chocolat, chantilly, cerises amarena et copeaux de chocolat',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80',
    category: 'anniversaires',
    inStock: true
  },
  {
    name: 'Gâteau de Mariage Royal',
    price: '150.00',
    description: 'Élégant gâteau à trois étages avec décoration en dentelle de sucre et fleurs comestibles',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
    category: 'mariages',
    inStock: true
  },
  {
    name: 'Petits Fours Assortis',
    price: '15.00',
    description: 'Assortiment de mignardises pour vos événements d\'entreprise',
    image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=800&q=80',
    category: 'entreprise',
    inStock: true
  },
  {
    name: 'Gâteau Baby Shower',
    price: '45.00',
    description: 'Gâteau personnalisé pour baby shower avec décorations thématiques',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80',
    category: 'babyshower',
    inStock: true
  }
];

export const migrateProductsToFirestore = async () => {
  try {
    console.log('Début de la migration...');
    const results = await Promise.all(
      products.map(product => addProduct(product))
    );
    console.log('Migration réussie:', results);
    return results;
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    throw error;
  }
};
