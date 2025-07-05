import { getDatabase, ref, push, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "solutions");

const form = document.getElementById("learning-form");
const itemList = document.getElementById("items-list");
const searchInput = document.getElementById("search-input");

form.onsubmit = (e) => {
    e.preventDefault();
    const data = {
        title: form.title.value,
        coordinator: form.coordinator.value,
        mentor: form.mentor.value,
        educationLevel: form.educationLevel.value,
        startDate: form.startDate.value,
        hours: form.hours.value,
        image: form.image.value
    };

    const id = form["item-id"].value;
    if (id) {
        update(ref(db, "solutions/" + id), data);
    } else {
        push(dbRef, data);
    }
    form.reset();
};

function renderItem(key, data) {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
        <h3>${data.title}</h3>
        <p><strong>רכז:</strong> ${data.coordinator}</p>
        <p><strong>מנחה:</strong> ${data.mentor}</p>
        <p><strong>שלב:</strong> ${data.educationLevel}</p>
        <p><strong>תאריך:</strong> ${data.startDate}</p>
        <p><strong>שעות:</strong> ${data.hours}</p>
        <img src="${data.image}" width="100%">
        <button onclick="editItem('${key}')">ערוך</button>
        <button onclick="deleteItem('${key}')">מחק</button>
    `;
    return card;
}

window.editItem = (key) => {
    const item = allItems[key];
    form["item-id"].value = key;
    Object.keys(item).forEach(k => form[k].value = item[k]);
};

window.deleteItem = (key) => {
    remove(ref(db, "solutions/" + key));
};

let allItems = {};
onValue(dbRef, (snapshot) => {
    itemList.innerHTML = "";
    allItems = snapshot.val() || {};
    Object.entries(allItems).forEach(([key, val]) => {
        itemList.appendChild(renderItem(key, val));
    });
});

searchInput.oninput = () => {
    const q = searchInput.value.toLowerCase();
    const filtered = Object.entries(allItems).filter(([_, val]) =>
        val.title.toLowerCase().includes(q) ||
        val.coordinator.toLowerCase().includes(q) ||
        val.mentor.toLowerCase().includes(q)
    );
    itemList.innerHTML = "";
    filtered.forEach(([key, val]) => itemList.appendChild(renderItem(key, val)));
};


function openModule(name) {
  document.getElementById('module-container').innerHTML = `<p>מודול ${name} נטען כאן...</p>`;
}
