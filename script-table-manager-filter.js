
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

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
const searchInput = document.getElementById("searchInput");
const levelFilter = document.getElementById("levelFilter");
const clearBtn = document.getElementById("clearFilters");

let allData = [];

function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.coordinator}</td>
            <td>${item.instructor}</td>
            <td>${item.educationLevel}</td>
            <td>${item.startDate}</td>
            <td>${item.hours}</td>
            <td><button onclick="editEntry('${item.key}')">✏️</button></td>
            <td><button onclick="deleteEntry('${item.key}')">🗑️</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLevel = levelFilter.value;

    const filtered = allData.filter(entry => {
        const matchText = entry.title.toLowerCase().includes(searchTerm) ||
                          entry.coordinator.toLowerCase().includes(searchTerm);
        const matchLevel = selectedLevel === "" || entry.educationLevel === selectedLevel;
        return matchText && matchLevel;
    });

    renderTable(filtered);
}

onValue(dbRef, (snapshot) => {
    allData = [];
    snapshot.forEach(child => {
        const data = child.val();
        allData.push({ ...data, key: child.key });
    });
    applyFilters();
});

searchInput.addEventListener("input", applyFilters);
levelFilter.addEventListener("change", applyFilters);
clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    levelFilter.value = "";
    applyFilters();
});

window.deleteEntry = function(key) {
    if (confirm("האם אתה בטוח שברצונך למחוק את הרשומה?")) {
        const delRef = ref(db, 'solutions/' + key);
        remove(delRef).then(() => alert("נמחק בהצלחה!"));
    }
};

window.editEntry = function(key) {
    const item = allData.find(e => e.key === key);
    if (!item) return;
    document.getElementById("editKey").value = key;
    document.getElementById("editTitle").value = item.title || "";
    document.getElementById("editCoordinator").value = item.coordinator || "";
    document.getElementById("editInstructor").value = item.instructor || "";
    document.getElementById("editLevel").value = item.educationLevel || "";
    document.getElementById("editDate").value = item.startDate || "";
    document.getElementById("editHours").value = item.hours || "";
    document.getElementById("editModal").style.display = "block";
};

document.getElementById("editForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const key = document.getElementById("editKey").value;
    const updatedData = {
        title: document.getElementById("editTitle").value,
        coordinator: document.getElementById("editCoordinator").value,
        instructor: document.getElementById("editInstructor").value,
        educationLevel: document.getElementById("editLevel").value,
        startDate: document.getElementById("editDate").value,
        hours: document.getElementById("editHours").value,
    };
    const updateRef = ref(db, 'solutions/' + key);
    update(updateRef, updatedData)
        .then(() => {
            alert("עודכן בהצלחה!");
            document.getElementById("editModal").style.display = "none";
        })
        .catch(err => alert("שגיאה בעדכון: " + err.message));
});
