// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYEdHutsO1eYn3iQvnVehl-t96__Plwo4",
  authDomain: "educatalog-63603.firebaseapp.com",
  databaseURL: "https://educatalog-63603-default-rtdb.firebaseio.com",
  projectId: "educatalog-63603",
  storageBucket: "educatalog-63603.appspot.com",
  messagingSenderId: "577201627806",
  appId: "1:577201627806:web:bd9d6346134d7c3dff518f",
  measurementId: "G-5JGDSHSDMP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const container = document.getElementById("cardsContainer");
const searchInput = document.getElementById("search");

let solutions = [];

function renderSolutions(data) {
  container.innerHTML = "";
  const filtered = data.filter(item =>
    item.name.includes(searchInput.value) ||
    item.coordinator.includes(searchInput.value)
  );

  filtered.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => showPopup(item);

    card.innerHTML = \`
      <img src="\${item.image}" alt="img" />
      <div class="card-info">
        <h3>\${item.name}</h3>
        <p>רכז פדגוגי: \${item.coordinator}</p>
        <p>מנחה: \${item.instructor}</p>
        <p>שלב חינוך: \${item.level}</p>
        <p>תאריך התחלה: \${item.date}</p>
        <p>שעות: \${item.hours}</p>
      </div>
    \`;

    container.appendChild(card);
  });
}

function showPopup(item) {
  const popup = document.getElementById("popup");
  const details = document.getElementById("popupDetails");
  details.innerHTML = \`
    <h2>\${item.name}</h2>
    <p><strong>רכז פדגוגי:</strong> \${item.coordinator}</p>
    <p><strong>מנחה:</strong> \${item.instructor}</p>
    <p><strong>שלב חינוך:</strong> \${item.level}</p>
    <p><strong>תאריך התחלה:</strong> \${item.date}</p>
    <p><strong>שעות:</strong> \${item.hours}</p>
    <p><strong>תיאור מלא:</strong> \${item.description}</p>
  \`;
  popup.style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

searchInput.addEventListener("input", () => renderSolutions(solutions));

db.ref("solutions").on("value", snapshot => {
  const val = snapshot.val();
  if (val) {
    solutions = Object.values(val);
    renderSolutions(solutions);
  }
});
