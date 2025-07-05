// Firebase הגדרות
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const solutionList = document.getElementById("solution-list");
const dbRef = ref(db, 'solutions');

onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  solutionList.innerHTML = '';
  for (let key in data) {
    const item = data[key];
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.name}</strong><br/>מנחה: ${item.mentor} | שעות: ${item.hours}`;
    solutionList.appendChild(li);
  }
});
