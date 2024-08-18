require('dotenv').config();
export const config = {
    firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    }
};