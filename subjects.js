
function loadSubjects() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Subjects</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openSubjectForm()">➕ הוסף תחום דעת</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead>
      <tbody id="subjects-body"></tbody>
    </table>
    <div id="subjectModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeSubjectForm()">&times;</span>
        <h3 id="subjectFormTitle">הוסף תחום דעת</h3>
        <input type="text" id="subjectId" placeholder="קוד מקצוע">
        <input type="text" id="subjectName" placeholder="שם מקצוע">
        <button onclick="saveSubject()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("subjects-body");
  db.ref("subjects").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.name}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editSubject('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteSubject('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openSubjectForm() {
  document.getElementById("subjectFormTitle").textContent = "הוסף תחום דעת";
  document.getElementById("subjectId").disabled = false;
  document.getElementById("subjectId").value = "";
  document.getElementById("subjectName").value = "";
  document.getElementById("subjectModal").style.display = "block";
}

function editSubject(id) {
  db.ref("subjects/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("subjectFormTitle").textContent = "ערוך תחום דעת";
    document.getElementById("subjectId").value = id;
    document.getElementById("subjectId").disabled = true;
    document.getElementById("subjectName").value = data.name;
    document.getElementById("subjectModal").style.display = "block";
  });
}

function saveSubject() {
  const id = document.getElementById("subjectId").value;
  const name = document.getElementById("subjectName").value;

  if (id && name) {
    db.ref("subjects/" + id).set({ name });
    closeSubjectForm();
    loadSubjects();
  } else {
    alert("יש למלא גם קוד וגם שם המקצוע");
  }
}

function deleteSubject(id) {
  if (confirm("למחוק את תחום הדעת?")) {
    db.ref("subjects/" + id).remove();
    loadSubjects();
  }
}

function closeSubjectForm() {
  document.getElementById("subjectModal").style.display = "none";
}

window.loadSubjects = loadSubjects;
