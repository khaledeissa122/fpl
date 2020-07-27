import firebase from "firebase/app";
import "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD4Vb5b6JL-NfOc1IMOnt_NYA4TfBwZwX4",
  authDomain: "fplgroups.firebaseapp.com",
  databaseURL: "https://fplgroups.firebaseio.com",
  projectId: "fplgroups",
  storageBucket: "fplgroups.appspot.com",
  messagingSenderId: "729897393143",
  appId: "1:729897393143:web:b459e1a6c4efe044d12cf2",
  measurementId: "G-DS5K40YWKP"
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : "";

export const db = firebase.firestore();
export const update = firebase;
