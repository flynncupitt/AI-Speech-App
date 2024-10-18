import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

/* const [apiKey, setApiKey] = useState<string | null>(null);
useEffect(() => {
        // Fetch the API key from the backend
        fetch('http://localhost:5000/api/key')
          .then((response) => response.json())
          .then((data) => setApiKey(data.apiKey))
          .catch((error) => console.error('Error fetching API key:', error));
      }, []); */



const firebaseConfig = {
        apiKey: "AIzaSyAu9fX-bfOdtdT_IRhCyKGcwct7ZWnrdEI" ,
        //apiKey: apiKey},
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
export const firestore = getFirestore(app);