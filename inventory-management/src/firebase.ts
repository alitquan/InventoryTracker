// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY0mcWdzq0t-TPsRKLhmAVqTdJnT7ztLc",
  authDomain: "inventorytracker-51443.firebaseapp.com",
  projectId: "inventorytracker-51443",
  storageBucket: "inventorytracker-51443.appspot.com",
  messagingSenderId: "557600890343",
  appId: "1:557600890343:web:6a5707971e6f48c3b0f142",
  measurementId: "G-46R8HG9WL4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
