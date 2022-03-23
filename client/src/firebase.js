import firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnxx5GOpAPWpZB3zqE5R4CpXjWRacsSdw",
  authDomain: "movieapp-f82a3.firebaseapp.com",
  projectId: "movieapp-f82a3",
  storageBucket: "movieapp-f82a3.appspot.com",
  messagingSenderId: "410641481426",
  appId: "1:410641481426:web:7f591e1b231c06a05b770b"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export {storage, firebase as default};