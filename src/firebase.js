import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCDaA8jMQQlz_B2DcXvNzwt-X8yW8Cj7M",
  authDomain: "react-login-system-1e6b5.firebaseapp.com",
  projectId: "react-login-system-1e6b5",
  storageBucket: "react-login-system-1e6b5.appspot.com",
  messagingSenderId: "523703729587",
  appId: "1:523703729587:web:df5ddc44ffb5d6e46f1fc6",
};
// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export default firebase;
