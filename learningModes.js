function loadLearningModes() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Learning Modes</h2>
    ${(userType === "admin" || userType === "operator") ? '<button onclick="openLearningModeForm()">➕ הוסף אופן למידה</button>' : ""}
    <table class="data-table">
      <thead><tr><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="learning-modes-body"></tbody>
    </table>
    <div id="learningModeModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeLearningModeForm()">&times;</span>
        <h3 id="learningModeFormTitle">הוסף אופן למידה</h3>
        <input type="hidden" id="learningModeKey">
        <input type="text" id="learningModeTitle" placeholder="כותרת אופן הלמידה">
        <button onclick="saveLearningMode()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("learning-modes-body");
  firebase.database().ref("learning_modes").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const key = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${d.title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editLearningMode('${key}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteLearningMode('${key}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openLearningModeForm() {
  document.getElementById("learningModeFormTitle").textContent = "הוסף אופן למידה";
  document.getElementById("learningModeKey").value = "";
  document.getElementById("learningModeTitle").value = "";
  document.getElementById("learningModeModal").style.display = "block";
}

function editLearningMode(key) {
  firebase.database().ref("learning_modes/" + key).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("learningModeFormTitle").textContent = "ערוך אופן למידה";
    document.getElementById("learningModeKey").value = key;
    document.getElementById("learningModeTitle").value = data.title;
    document.getElementById("learningModeModal").style.display = "block";
  });
}

function saveLearningMode() {
  const key = document.getElementById("learningModeKey").value;
  const title = document.getElementById("learningModeTitle").value;

  if (!title.trim()) {
    alert("יש להזין כותרת אופן למידה");
    return;
  }

  const ref = firebase.database().ref("learning_modes");

  if (key) {
    // עדכון רשומה קיימת
    ref.child(key).update({ title }).then(() => {
      closeLearningModeForm();
      loadLearningModes();
    });
  } else {
    // הוספה עם מפתח אוטומטי
    ref.push({ title }).then(() => {
      closeLearningModeForm();
      loadLearningModes();
    });
  }
}

function deleteLearningMode(key) {
  if (confirm("למחוק את אופן הלמידה?")) {
    firebase.database().ref("learning_modes/" + key).remove().then(() => {
      loadLearningModes();
    });
  }
}

function closeLearningModeForm() {
  document.getElementById("learningModeModal").style.display = "none";
}

window.loadLearningModes = loadLearningModes;
