import firebase from 'firebase'

function initializeFireBase() {
  const firebaseConfig = {
    apiKey: "AIzaSyB9teFw4HrRbUvxub-rlzjBrrzLt4SupBM",
    authDomain: "socialize-2e398.firebaseapp.com",
    databaseURL: "https://socialize-2e398.firebaseio.com",
    projectId: "socialize-2e398",
    storageBucket: "socialize-2e398.appspot.com",
    messagingSenderId: "679269668118",
    appId: "1:679269668118:web:2a9ddb1345d9918c3c6c37",
    measurementId: "G-8KZPREYZJ8"
  };
  firebase.initializeApp(firebaseConfig);
}

export default initializeFireBase