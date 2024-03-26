import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// initialization
const firebaseConfig = {
  apiKey: "AIzaSyCwHo99ReuQWQGahKmANIOOxYOp8z09E_w",
  authDomain: "nextjs-chat-app-6ab88.firebaseapp.com",
  projectId: "nextjs-chat-app-6ab88",
  storageBucket: "nextjs-chat-app-6ab88.appspot.com",
  messagingSenderId: "431493590910",
  appId: "1:431493590910:web:369a65977c953a74000d2f",
  measurementId: "G-RCS28GZLHN",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();
