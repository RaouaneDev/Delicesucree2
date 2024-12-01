import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Gestion des erreurs Firebase
const handleAuthError = (error) => {
  console.error('Firebase Auth Error:', error);
  switch (error.code) {
    case 'auth/invalid-email':
      throw new Error('Adresse email invalide.');
    case 'auth/user-disabled':
      throw new Error('Ce compte a été désactivé.');
    case 'auth/user-not-found':
      throw new Error('Aucun compte ne correspond à cet email.');
    case 'auth/wrong-password':
      throw new Error('Mot de passe incorrect.');
    case 'auth/email-already-in-use':
      throw new Error('Cette adresse email est déjà utilisée.');
    case 'auth/operation-not-allowed':
      throw new Error('Cette méthode de connexion n\'est pas activée.');
    case 'auth/weak-password':
      throw new Error('Le mot de passe est trop faible.');
    case 'auth/popup-blocked':
      throw new Error('La fenêtre popup a été bloquée. Veuillez autoriser les popups pour ce site.');
    case 'auth/popup-closed-by-user':
      throw new Error('La fenêtre de connexion a été fermée.');
    case 'auth/cancelled-popup-request':
      throw new Error('Opération annulée.');
    case 'auth/network-request-failed':
      throw new Error('Erreur de connexion réseau. Vérifiez votre connexion internet.');
    default:
      throw new Error('Une erreur est survenue lors de l\'authentification.');
  }
};

// Connexion avec Google
export const signInWithGoogle = async () => {
  try {
    console.log('Début de la connexion Google...');
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Connexion Google réussie:', result.user);
    return result.user;
  } catch (error) {
    console.error('Erreur détaillée de connexion Google:', {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential
    });
    throw handleAuthError(error);
  }
};

// Connexion avec Facebook
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Connexion anonyme
export const signInAsGuest = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Créer un nouveau compte
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Connexion
export const loginUser = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Déconnexion
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Réinitialiser le mot de passe
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Observer les changements d'état de l'authentification
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
