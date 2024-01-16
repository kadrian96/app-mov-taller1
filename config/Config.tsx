// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database';
import{getAuth} from'firebase/auth'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmUoGozorlIuAA1esKLAhIFH9wDX7NRwI",
  authDomain: "taller01-28c90.firebaseapp.com",
  projectId: "taller01-28c90",
  storageBucket: "taller01-28c90.appspot.com",
  messagingSenderId: "663675947597",
  appId: "1:663675947597:web:2d86ac5caae065cd586a04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const storage =  getStorage(app)
//export const auth= getAuth(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

