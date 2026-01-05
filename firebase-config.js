// Firebase Configuration
// To enable cross-device sync:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Enable Firestore Database (Start in test mode)
// 4. Go to Project Settings → General → Your apps → Web
// 5. Copy the config object and paste it below
// 6. In Firestore, create a collection called "schedules" (or change COLLECTION_NAME below)

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyD9f5qg931JcH8fzczc-LWcoN-qNvpvI60",
    authDomain: "snow-scheduler.firebaseapp.com",
    projectId: "snow-scheduler",
    storageBucket: "snow-scheduler.firebasestorage.app",
    messagingSenderId: "356767862404",
    appId: "1:356767862404:web:6221a59ca348ea4ea17cd1"
};

const COLLECTION_NAME = 'schedules';
const DOCUMENT_ID = 'main'; // Single document for all data

// Set to true if you want to use Firebase (after configuring above)
const USE_FIREBASE = true;

