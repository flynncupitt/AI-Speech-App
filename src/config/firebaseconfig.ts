import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
        // apiKey: import.meta.env.VITE_API_KEY,
        apiKey: "AIzaSyAu9fX-bfOdtdT_IRhCyKGcwct7ZWnrdEI",
        authDomain: "ai-speech-app-82a66.firebaseapp.com",
        projectId: "ai-speech-app-82a66",
        storageBucket: "ai-speech-app-82a66.appspot.com",
        messagingSenderId: "171167486699",
        appId: "1:171167486699:web:95be880595bc72131e24ae",
        measurementId: "G-FKN0YN8V11"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);