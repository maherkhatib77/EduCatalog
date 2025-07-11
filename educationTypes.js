
function loadEducationTypes() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Education Types</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openEducationTypeForm()">➕ הוסף סוג חינוך</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="education-types-body"></tbody>
    </table>
    <div id="educationTypeModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeEducationTypeForm()">&times;</span>
        <h3 id="educationTypeFormTitle">הוסף סוג חינוך</h3>
        <input type="text" id="educationTypeId" placeholder="קוד סוג">
        <input type="text" id="educationTypeTitle" placeholder="כותרת סוג חינוך">
        <button onclick="saveEducationType()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("education-types-body");
  db.ref("education_types").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editEducationType('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteEducationType('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openEducationTypeForm() {
  document.getElementById("educationTypeFormTitle").textContent = "הוסף סוג חינוך";
  document.getElementById("educationTypeId").disabled = false;
  document.getElementById("educationTypeId").value = "";
  document.getElementById("educationTypeTitle").value = "";
  document.getElementById("educationTypeModal").style.display = "block";
}

function editEducationType(id) {
  db.ref("education_types/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("educationTypeFormTitle").textContent = "ערוך סוג חינוך";
    document.getElementById("educationTypeId").value = id;
    document.getElementById("educationTypeId").disabled = true;
    document.getElementById("educationTypeTitle").value = data.title;
    document.getElementById("educationTypeModal").style.display = "block";
  });
}

function saveEducationType() {
  const id = document.getElementById("educationTypeId").value;
  const title = document.getElementById("educationTypeTitle").value;

  if (id && title) {
    db.ref("education_types/" + id).set({ title });
    closeEducationTypeForm();
    loadEducationTypes();
  } else {
    alert("יש למלא גם קוד וגם כותרת");
  }
}

function deleteEducationType(id) {
  if (confirm("למחוק את סוג החינוך?")) {
    db.ref("education_types/" + id).remove();
    loadEducationTypes();
  }
}

function closeEducationTypeForm() {
  document.getElementById("educationTypeModal").style.display = "none";
}

window.loadEducationTypes = loadEducationTypes;
