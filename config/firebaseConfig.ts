import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'dotenv/config';

// Initialize Firebase
const firebaseConfig = JSON.parse(process.env["FIREBASE_CLIENT_OPTIONS"]!);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
