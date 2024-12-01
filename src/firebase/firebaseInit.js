import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseconfig'; 
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };