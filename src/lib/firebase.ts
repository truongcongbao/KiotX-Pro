import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, setDoc, DocumentReference, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

const resolvedConfig = {
  ...firebaseConfig,
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
};

const resolvedDbId = metaEnv.VITE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId;

const app = initializeApp(resolvedConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true
}, resolvedDbId);
export const googleAuthProvider = new GoogleAuthProvider();

export function cleanObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }
  const cleaned: any = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== undefined) {
      cleaned[key] = cleanObject(value);
    }
  }
  return cleaned;
}

export async function safeSetDoc(docRef: DocumentReference<any, any>, data: any) {
  return setDoc(docRef, cleanObject(data));
}

export async function safeDeleteDoc(docRef: DocumentReference<any, any>) {
  try {
    return await deleteDoc(docRef);
  } catch (err) {
    console.error("Firebase Firestore deleteDoc error: ", err);
    throw err;
  }
}
