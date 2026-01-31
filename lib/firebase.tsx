//This is Firebase config file
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Runtime validation: fail early with a helpful message if the API key is missing
if (!firebaseConfig.apiKey) {
  // Log more details in dev to help debugging
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(
      "Missing NEXT_PUBLIC_FIREBASE_API_KEY. Add it to your .env.local (or environment) and restart the dev server. Current value:",
      firebaseConfig.apiKey,
    );
  }
  throw new Error(
    "Firebase configuration error: NEXT_PUBLIC_FIREBASE_API_KEY is missing or invalid. See .env.local",
  );
}

// Avoid re-initializing app during HMR / multiple imports
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);