// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAu9fX-bfOdtdT_IRhCyKGcwct7ZWnrdEI",
  authDomain: "ai-speech-app-82a66.firebaseapp.com",
  projectId: "ai-speech-app-82a66",
  storageBucket: "ai-speech-app-82a66.appspot.com",
  messagingSenderId: "171167486699",
  appId: "1:171167486699:web:95be880595bc72131e24ae",
  measurementId: "G-FKN0YN8V11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Storage
export const auth = getAuth(app);
export const storage = getStorage(app);
