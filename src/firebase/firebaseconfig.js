import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDktFyrcADqu3aZp0zZIjU_RHVUgaQssWA",
    authDomain: "hardware-inventory-a9aaa.firebaseapp.com",
    projectId: "hardware-inventory-a9aaa",
    storageBucket: "hardware-inventory-a9aaa.firebasestorage.app",
    messagingSenderId: "727702279183",
    appId: "1:727702279183:web:dd0077eb7dad270161bf7a",
    measurementId: "G-896GLQ0H43"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export default firebaseConfig; 
  export { db };