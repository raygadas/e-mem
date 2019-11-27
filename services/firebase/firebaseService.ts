import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyBQfJEeQfQhHsH4Y4iNsc2COqJjl-WPDbs",
  authDomain: "e-mem-54f2f.firebaseapp.com",
  databaseURL: "https://e-mem-54f2f.firebaseio.com",
  projectId: "e-mem-54f2f",
  storageBucket: "e-mem-54f2f.appspot.com",
  messagingSenderId: "241277518018",
  appId: "1:241277518018:web:c6bfca0b9877a3e4243b5b",
  measurementId: "G-QXX9DVQNXC"
};

class FirebaseService {
  private static instance: FirebaseService;
  public auth!: firebase.auth.Auth;
  public db!: firebase.firestore.Firestore;
  public googleProvider!: firebase.auth.GoogleAuthProvider;

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }

    return FirebaseService.instance;
  }

  private constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      this.googleProvider = new firebase.auth.GoogleAuthProvider();
    }
  }

  public doSignInWithEmailAndPassword = (email: string, password: string): Promise<firebase.auth.UserCredential> | undefined => {
    if (this.auth) {
      return this.auth.signInWithEmailAndPassword(email, password);
    } else {
      Promise.reject;
    }
  }

  public doSignOut = () => {
    if (this.auth) {
      return this.auth.signOut();
    }
  }

  public doPasswordReset = (email: string) => {
    if (this.auth && this.auth.sendPasswordResetEmail) {
      return this.auth.sendPasswordResetEmail(email);
    }
  }

  public doPasswordUpdate = (email: string) => {
    if (this.auth && this.auth.sendPasswordResetEmail) {
      return this.auth.sendPasswordResetEmail(email);
    }
  }
}
export default FirebaseService;