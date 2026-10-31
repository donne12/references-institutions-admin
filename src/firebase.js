// Firebase v12 compat layer: keeps the namespaced API (firebase.auth(), firebase.firestore(), ...) used across the app.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const configOptions = {
  apiKey: "AIzaSyB9xHHUz7UEj0oMQQKlDsSS4zOiDpI5IHQ",
  authDomain: "references-entreprises.firebaseapp.com",
  databaseURL: "https://references-entreprises-default-rtdb.firebaseio.com/",
  projectId: "references-entreprises",
  storageBucket: "references-entreprises.appspot.com",
  messagingSenderId: "857822533373",
  appId: "1:857822533373:android:66e1c94f5730ad4327d094"
};

if (!firebase.apps.length) {
  firebase.initializeApp(configOptions);
}

export const auth = () => firebase.auth();
export const firestore = () => firebase.firestore();
export const storage = () => firebase.storage();
export default firebase;
