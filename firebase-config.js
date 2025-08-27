// firebase-config.js
// Import fungsi yang Anda butuhkan dari SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// Opsional: Jika Anda ingin menggunakan Analytics
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";


// Konfigurasi aplikasi web Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyCxmxieVpqc0-TciZvHF4osauonTimYDUo",
    authDomain: "chat-app-78f7d.firebaseapp.com",
    projectId: "chat-app-78f7d",
    storageBucket: "chat-app-78f7d.firebasestorage.app",
    messagingSenderId: "763052983578",
    appId: "1:763052983578:web:b70c608408042968dd58a3",
    measurementId: "G-PRKEW7MTQH" // measurementId ini untuk Analytics
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Dapatkan referensi ke Firestore
// Opsional: Inisialisasi Analytics jika Anda menggunakannya
// const analytics = getAnalytics(app);

// Ekspor db dan serverTimestamp agar bisa digunakan di script.js
export { db, serverTimestamp };
