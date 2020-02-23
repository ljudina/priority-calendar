//Import Firebase App configuration
import firebaseConfig from './firebaseConfig';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseDb = firebase.database(firebaseApp);
export const firebaseAuth = firebase.auth(firebaseApp);