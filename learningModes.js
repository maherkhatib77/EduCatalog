
function loadLearningModes() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Learning Modes</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openLearningModeForm()">➕ הוסף אופן למידה</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="learning-modes-body"></tbody>
    </table>
    <div id="learningModeModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeLearningModeForm()">&times;</span>
        <h3 id="learningModeFormTitle">הוסף אופן למידה</h3>
        <input type="text" id="learningModeId" placeholder="קוד">
        <input type="text" id="learningModeTitle" placeholder="כותרת אופן הלמידה">
        <button onclick="saveLearningMode()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("learning-modes-body");
  db.ref("learning_modes").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editLearningMode('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteLearningMode('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openLearningModeForm() {
  document.getElementById("learningModeFormTitle").textContent = "הוסף אופן למידה";
  document.getElementById("learningModeId").disabled = false;
  document.getElementById("learningModeId").value = "";
  document.getElementById("learningModeTitle").value = "";
  document.getElementById("learningModeModal").style.display = "block";
}

function editLearningMode(id) {
  db.ref("learning_modes/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("learningModeFormTitle").textContent = "ערוך אופן למידה";
    document.getElementById("learningModeId").value = id;
    document.getElementById("learningModeId").disabled = true;
    document.getElementById("learningModeTitle").value = data.title;
    document.getElementById("learningModeModal").style.display = "block";
  });
}

function saveLearningMode() {
  const id = document.getElementById("learningModeId").value;
  const title = document.getElementById("learningModeTitle").value;

  if (id && title) {
    db.ref("learning_modes/" + id).set({ title });
    closeLearningModeForm();
    loadLearningModes();
  } else {
    alert("יש למלא גם קוד וגם כותרת");
  }
}

function deleteLearningMode(id) {
  if (confirm("למחוק את אופן הלמידה?")) {
    db.ref("learning_modes/" + id).remove();
    loadLearningModes();
  }
}

function closeLearningModeForm() {
  document.getElementById("learningModeModal").style.display = "none";
}

window.loadLearningModes = loadLearningModes;
