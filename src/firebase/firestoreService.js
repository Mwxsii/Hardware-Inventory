// src/firebase/firestoreService.js (or .ts)

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDktFyrcADqu3aZp0zZIjU_RHVUgaQssWA",
    authDomain: "hardware-inventory-a9aaa.firebaseapp.com",
    projectId: "hardware-inventory-a9aaa",
    storageBucket: "hardware-inventory-a9aaa.firebasestorage.app",
    messagingSenderId: "727702279183",
    appId: "1:727702279183:web:dd0077eb7dad270161bf7a",
    measurementId: "G-896GLQ0H43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to add data to Firestore
export const addData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'yourCollectionName'), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Optionally return the document ID
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Rethrow the error for further handling if needed
  }
};

// Function to fetch data from Firestore
export const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'yourCollectionName'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e; // Rethrow the error for further handling if needed
  }
};

// Export the db instance if needed
export { db };