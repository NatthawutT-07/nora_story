import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDmScXPt7-BPuW2Jvq_ep1s5-Dh2hBeWEA",
    authDomain: "nora-dev-ea18d.firebaseapp.com",
    projectId: "nora-dev-ea18d",
    storageBucket: "nora-dev-ea18d.firebasestorage.app",
    messagingSenderId: "661654756419",
    appId: "1:661654756419:web:3c8affb9ae38b30e36c8f6",
    measurementId: "G-V0X8Z7B0XZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, storage, analytics };
