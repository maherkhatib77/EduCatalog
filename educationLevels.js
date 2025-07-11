
function loadEducationLevels() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Education Levels</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openEducationLevelForm()">➕ הוסף שלב חינוך</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="education-levels-body"></tbody>
    </table>
    <div id="educationLevelModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeEducationLevelForm()">&times;</span>
        <h3 id="educationLevelFormTitle">הוסף שלב חינוך</h3>
        <input type="text" id="educationLevelId" placeholder="קוד שלב">
        <input type="text" id="educationLevelTitle" placeholder="כותרת שלב">
        <button onclick="saveEducationLevel()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("education-levels-body");
  db.ref("education_levels").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editEducationLevel('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteEducationLevel('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openEducationLevelForm() {
  document.getElementById("educationLevelFormTitle").textContent = "הוסף שלב חינוך";
  document.getElementById("educationLevelId").disabled = false;
  document.getElementById("educationLevelId").value = "";
  document.getElementById("educationLevelTitle").value = "";
  document.getElementById("educationLevelModal").style.display = "block";
}

function editEducationLevel(id) {
  db.ref("education_levels/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("educationLevelFormTitle").textContent = "ערוך שלב חינוך";
    document.getElementById("educationLevelId").value = id;
    document.getElementById("educationLevelId").disabled = true;
    document.getElementById("educationLevelTitle").value = data.title;
    document.getElementById("educationLevelModal").style.display = "block";
  });
}

function saveEducationLevel() {
  const id = document.getElementById("educationLevelId").value;
  const title = document.getElementById("educationLevelTitle").value;

  if (id && title) {
    db.ref("education_levels/" + id).set({ title });
    closeEducationLevelForm();
    loadEducationLevels();
  } else {
    alert("יש למלא גם קוד וגם כותרת");
  }
}

function deleteEducationLevel(id) {
  if (confirm("למחוק את שלב החינוך?")) {
    db.ref("education_levels/" + id).remove();
    loadEducationLevels();
  }
}

function closeEducationLevelForm() {
  document.getElementById("educationLevelModal").style.display = "none";
}

window.loadEducationLevels = loadEducationLevels;
