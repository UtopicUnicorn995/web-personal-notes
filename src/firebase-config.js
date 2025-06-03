import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1k_ntIBRuj0Liw9C2PDUEfMQLpmTUbaA",
  authDomain: "personalnotes-f267f.firebaseapp.com",
  projectId: "personalnotes-f267f",
  storageBucket: "personalnotes-f267f.firebasestorage.app",
  messagingSenderId: "1058350876900",
  appId: "1:1058350876900:web:1ab13426027c661c1544f1",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)