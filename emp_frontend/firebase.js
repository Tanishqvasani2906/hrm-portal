// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1GWbqrPAu6_RGGtw-UZJB7UyMWPH_fVA",
  authDomain: "hrm-portal-97c34.firebaseapp.com",
  projectId: "hrm-portal-97c34",
  storageBucket: "hrm-portal-97c34.appspot.com",
  messagingSenderId: "936221731580",
  appId: "1:936221731580:web:32d73f8973f16b22e98579",
  measurementId: "G-NZGCJ3804D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
