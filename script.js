// script.js
import { db, serverTimestamp } from './firebase-config.js'; // Impor db dan serverTimestamp
import { collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessage');

// ID pengguna unik untuk sesi ini (bisa disimpan di localStorage)
const userId = "user_" + Math.random().toString(36).substr(2, 9);
console.log("Current User ID:", userId);

// Fungsi untuk menampilkan pesan
function displayMessage(doc) {
    const data = doc.data();
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Menentukan apakah pesan dikirim oleh pengguna saat ini
    if (data.userId === userId) {
        messageElement.classList.add('sent');
    } else {
        messageElement.classList.add('received');
    }

    // Pastikan timestamp ada sebelum mencoba mengaksesnya
    const time = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'Loading...';

    messageElement.innerHTML = `
        <p>${data.text}</p>
        <span class="timestamp">${time}</span>
        ${data.userId === userId ? `<button class="delete-btn" data-id="${doc.id}">Hapus</button>` : ''}
    `;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Gulir ke bawah

    // Tambahkan event listener untuk tombol hapus
    if (data.userId === userId) {
        messageElement.querySelector('.delete-btn').addEventListener('click', (e) => {
            const messageIdToDelete = e.target.dataset.id;
            deleteMessage(messageIdToDelete);
        });
    }
}

// Fungsi untuk mengirim pesan
sendMessageBtn.addEventListener('click', async () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        // Menggunakan addDoc dari Modular SDK
        await addDoc(collection(db, 'messages'), {
            text: messageText,
            timestamp: serverTimestamp(), // Menggunakan serverTimestamp yang diimpor
            userId: userId
        });
        messageInput.value = '';
    }
});

// Fungsi untuk menghapus pesan
async function deleteMessage(messageId) {
    if (confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
        try {
            // Menggunakan deleteDoc dari Modular SDK
            await deleteDoc(doc(db, 'messages', messageId));
            console.log("Pesan berhasil dihapus!");
        } catch (error) {
            console.error("Error menghapus pesan: ", error);
        }
    }
}

// Mendapatkan pesan secara real-time dari Firestore
// Menggunakan query, orderBy, onSnapshot dari Modular SDK
const messagesCollection = collection(db, 'messages');
const q = query(messagesCollection, orderBy('timestamp'));

onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            displayMessage(change.doc);
        }
        if (change.type === 'modified') {
            console.log("Pesan dimodifikasi:", change.doc.data());
            // Logika untuk memperbarui pesan yang ada di DOM jika diperlukan
        }
        if (change.type === 'removed') {
            const messageToRemove = document.querySelector(`.message .delete-btn[data-id="${change.doc.id}"]`)?.parentElement;
            if (messageToRemove) {
                messagesDiv.removeChild(messageToRemove);
            }
        }
    });
});

// Tambahkan event listener untuk menekan Enter
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessageBtn.click();
    }
});
