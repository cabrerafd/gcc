import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: '',
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.messagingSenderId,
}
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  console.log('Firebase Initialized')
}

export default firebase
