// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database';
import{getAuth} from'firebase/auth'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-h4Z87WJn3rLZ7oIU8uFTUKY9TOThD64",
  authDomain: "app-mov2-crud2-78c79.firebaseapp.com",
  databaseURL: "https://app-mov2-crud2-78c79-default-rtdb.firebaseio.com",
  projectId: "app-mov2-crud2-78c79",
  storageBucket: "app-mov2-crud2-78c79.appspot.com",
  messagingSenderId: "482399744880",
  appId: "1:482399744880:web:5ae50ebf48841990dc15b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const storage = getStorage(app)

//export const auth= getAuth(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});