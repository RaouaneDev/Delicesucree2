const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { firebaseConfig } = require('../firebase/config');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setUserAsAdmin(userEmail) {
  try {
    await setDoc(doc(db, 'admins', userEmail), {
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log('Droits administrateur accordés avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'attribution des droits admin:', error);
  }
}

// Remplacer par l'email de l'utilisateur Google connecté
const adminEmail = 'votre.email@gmail.com';
setUserAsAdmin(adminEmail);
