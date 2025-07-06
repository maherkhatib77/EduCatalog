
import { db, ref, push, set, onValue, remove } from './firebase.js';

function showModule(id) {
  document.querySelectorAll('.module-section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function logout() {
  window.location.href = "index.html";
}
function openModule(moduleName) {
  const container = document.getElementById("moduleContent");
  container.innerHTML = `<h2>טוען את מודול ${moduleName}...</h2>`;
  // בעתיד נטען כאן את תוכן המודול בפועל
}

// Load solutions
const solRef = ref(db, 'solutions');
onValue(solRef, snapshot => {
  const tbody = document.querySelector('#solutionsTable tbody');
  tbody.innerHTML = '';
  snapshot.forEach(child => {
    const val = child.val();
    const row = `<tr>
      <td>${val.solutionName}</td><td>${val.pedagogicGuide}</td><td>${val.instructorName}</td>
      <td>${val.startDate}</td><td>${val.educationLevel}</td><td>${val.hours}</td>
      <td><button onclick="alert('עריכה בקרוב')">✏️</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
});

// Load instructors
const instRef = ref(db, 'instructors');
onValue(instRef, snapshot => {
  const tbody = document.querySelector('#instructorsTable tbody');
  tbody.innerHTML = '';
  snapshot.forEach(child => {
    const val = child.val();
    const row = `<tr>
      <td>${val.id}</td><td>${val.name}</td><td>${val.phone}</td><td>${val.email}</td>
      <td><button onclick="alert('עריכה בקרוב')">✏️</button></td>
    </tr>`;
    tbody.innerHTML += row;
  });
});
