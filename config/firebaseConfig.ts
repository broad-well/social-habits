import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';


// Initialize Firebase
const firebaseConfig = JSON.parse(Constants.expoConfig?.extra?.firebaseClientOptions);

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
