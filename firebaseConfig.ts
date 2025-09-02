

// Firebase is now loaded globally via script tags in index.html
// This declaration tells TypeScript that the 'firebase' variable exists globally.
declare const firebase: any;

const firebaseConfig = {
  apiKey: "AIzaSyAsRt5kZoc-JjKf3tRWdpVtE8_xiVp8PY8",
  authDomain: "markazjabir.firebaseapp.com",
  projectId: "markazjabir",
  storageBucket: "markazjabir.firebasestorage.app",
  messagingSenderId: "1056639573828",
  appId: "1:1056639573828:web:33c028066e194b63a2c111",
  measurementId: "G-9RPEYJRPF1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
