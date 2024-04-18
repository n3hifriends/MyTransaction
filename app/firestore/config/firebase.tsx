// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app"
import { Firestore, getFirestore } from "firebase/firestore"

/**
 * Firebase project:
 * https://console.firebase.google.com/project/mytransaction-5c854/firestore/databases/-default-/data/~2Ftransaction~2FQWprtoRYnXAsve9E5PDP?view=panel-view&scopeType=collection&scopeName=%2Ftransaction&query=
 */

export const COLLECTION_transaction = "transaction"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5nZ9Ve0pzUak55ySY5rEREYCoWlm-4cA",
  authDomain: "mytransaction-5c854.firebaseapp.com",
  projectId: "mytransaction-5c854",
  storageBucket: "mytransaction-5c854.appspot.com",
  messagingSenderId: "11536433392",
  appId: "1:11536433392:web:795f5424a97f4194e00235",
  measurementId: "G-0439SJHLQX",
}

// Initialize Firebase
const firebase: FirebaseApp = initializeApp(firebaseConfig)
export const firestore: Firestore = getFirestore(firebase)
