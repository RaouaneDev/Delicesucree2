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
    case 'auth/operation-not-allowed':
      throw new Error('Cette méthode de connexion n\'est pas activée.');
    case 'auth/popup-blocked':
      throw new Error('La fenêtre popup a été bloquée. Veuillez autoriser les popups pour ce site.');
    case 'auth/popup-closed-by-user':
      throw new Error('La fenêtre de connexion a été fermée avant la fin du processus.');
    case 'auth/cancelled-popup-request':
      throw new Error('La demande de connexion a été annulée.');
    case 'auth/user-disabled':
      throw new Error('Ce compte utilisateur a été désactivé.');
    default:
      throw error;
  }
};

// Connexion avec Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
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
