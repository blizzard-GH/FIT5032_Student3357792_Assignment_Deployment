import { initializeApp } from 'firebase/app'
import { getFirestore, serverTimestamp } from 'firebase/firestore' // Importing Firestore
// Importing emulators dependencies
// import { connectFirestoreEmulator } from 'firebase/firestore'
// import { getAuth, connectAuthEmulator } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
}

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const firebaseapp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseapp)

// Const needed for emulator to run (requre getAuth())
// const auth = getAuth()

// // Emulator
// if (import.meta.env.MODE === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080)
//   console.log('Connected to Firestore emulator')
//   connectAuthEmulator(auth, 'http://localhost:9099')
//   console.log('Auth emulator connected')
// } else {
//   console.log('Running in production mode')
//   console.log(import.meta.env.MODE)
//   console.log('Firestore emulator and Auth emulator are not connected')
// }

export { db, serverTimestamp }
