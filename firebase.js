// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-analytics.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    deleteDoc, 
    onSnapshot,
    doc,  
    getDoc, 
    updateDoc, 
    setDoc
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHgt6DesHnkFzJwdcXN6UjTIGxOU82YNM",
  authDomain: "predictorapp-2022.firebaseapp.com",
  projectId: "predictorapp-2022",
  storageBucket: "predictorapp-2022.appspot.com",
  messagingSenderId: "928015654207",
  appId: "1:928015654207:web:8df018cbec50bd9887878a",
  measurementId: "G-QN11P3JHKV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

export const getClinicalDetails = () => getDocs(collection(db, 'clinicalDetails'));

export const onGetData = (callback) => onSnapshot(collection(db,'clinicalDetails'), callback);

export const deleteData = id => deleteDoc(doc(db, 'clinicalDetails', id));

export const getPrediction = id => getDoc(doc(db, 'predictions', id));

export const getClinicalDetail = id => getDoc(doc(db, 'clinicalDetails', id));

export const updatePrediction = (id, newData) => updateDoc(doc(db, 'predictions', id), newData);

export const deletePrediction = id => deleteDoc(doc(db, 'predictions', id));

export const addVerifiedData = (id, verData) => setDoc(doc(db, 'verifiedData', id), verData);


import { getStorage, ref , getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();
// Create a storage reference from our storage service
const storageRef = ref(storage);

export const getUrlImage = name => getDownloadURL(ref(storage, 'images/' + name));