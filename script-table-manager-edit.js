
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYEdHutsO1eYn3iQvnVehl-t96__Plwo4",
  authDomain: "educatalog-63603.firebaseapp.com",
  databaseURL: "https://educatalog-63603-default-rtdb.firebaseio.com",
  projectId: "educatalog-63603",
  storageBucket: "educatalog-63603.appspot.com",
  messagingSenderId: "577201627806",
  appId: "1:577201627806:web:bd9d6346134d7c3dff518f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, 'solutions');

const tableBody = document.querySelector("#solutionsTable tbody");
const modal = document.getElementById("editModal");
const form = document.getElementById("editForm");

onValue(dbRef, (snapshot) => {
    tableBody.innerHTML = "";
    snapshot.forEach(child => {
        const data = child.val();
        const key = child.key;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.title || ""}</td>
            <td>${data.coordinator || ""}</td>
            <td>${data.instructor || ""}</td>
            <td>${data.educationLevel || ""}</td>
            <td>${data.startDate || ""}</td>
            <td>${data.hours || ""}</td>
            <td><button onclick="editEntry('${key}')">✏️</button></td>
            <td><button onclick="deleteEntry('${key}')">🗑️</button></td>
        `;
        tableBody.appendChild(row);
    });
});

window.deleteEntry = function(key) {
    if (confirm("האם אתה בטוח שברצונך למחוק את הרשומה?")) {
        const delRef = ref(db, 'solutions/' + key);
        remove(delRef)
            .then(() => alert("נמחק בהצלחה!"))
            .catch(err => alert("שגיאה במחיקה: " + err.message));
    }
};

window.editEntry = function(key) {
    const currentRef = ref(db, 'solutions/' + key);
    onValue(currentRef, (snapshot) => {
        const data = snapshot.val();
        form.dataset.key = key;
        form.coordinator.value = data.coordinator || "";
        form.title.value = data.title || "";
        form.instructor.value = data.instructor || "";
        form.educationLevel.value = data.educationLevel || "";
        form.startDate.value = data.startDate || "";
        form.hours.value = data.hours || "";
        modal.style.display = "block";
    }, { onlyOnce: true });
};

document.getElementById("closeModal").onclick = () => modal.style.display = "none";

form.addEventListener("submit", function(e) {
    e.preventDefault();
    const key = form.dataset.key;
    const updates = {
        coordinator: form.coordinator.value,
        title: form.title.value,
        instructor: form.instructor.value,
        educationLevel: form.educationLevel.value,
        startDate: form.startDate.value,
        hours: form.hours.value
    };
    update(ref(db, 'solutions/' + key), updates)
        .then(() => {
            alert("עודכן בהצלחה");
            modal.style.display = "none";
        })
        .catch(err => alert("שגיאה בעדכון: " + err.message));
});
