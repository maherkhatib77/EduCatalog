function loadEducationTypes() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Education Types</h2>
    ${(userType === "admin" || userType === "operator") ? '<button onclick="openEducationTypeForm()">➕ הוסף סוג חינוך</button>' : ""}
    <table class="data-table">
      <thead><tr><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="education-types-body"></tbody>
    </table>
    <div id="educationTypeModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeEducationTypeForm()">&times;</span>
        <h3 id="educationTypeFormTitle">הוסף סוג חינוך</h3>
        <input type="hidden" id="educationTypeKey">
        <input type="text" id="educationTypeTitle" placeholder="כותרת סוג החינוך">
        <button onclick="saveEducationType()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("education-types-body");
  firebase.database().ref("education_types").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const key = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${d.Title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editEducationType('${key}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteEducationType('${key}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openEducationTypeForm() {
  document.getElementById("educationTypeFormTitle").textContent = "הוסף סוג חינוך";
  document.getElementById("educationTypeKey").value = "";
  document.getElementById("educationTypeTitle").value = "";
  document.getElementById("educationTypeModal").style.display = "block";
}

function editEducationType(key) {
  firebase.database().ref("education_types/" + key).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("educationTypeFormTitle").textContent = "ערוך סוג חינוך";
    document.getElementById("educationTypeKey").value = key;
    document.getElementById("educationTypeTitle").value = data.Title;
    document.getElementById("educationTypeModal").style.display = "block";
  });
}

function saveEducationType() {
  const key = document.getElementById("educationTypeKey").value;
  const title = document.getElementById("educationTypeTitle").value;

  if (!title.trim()) {
    alert("יש להזין כותרת סוג חינוך");
    return;
  }

  const ref = firebase.database().ref("education_types");

  if (key) {
    // עדכון רשומה קיימת
    ref.child(key).update({ Title: title }).then(() => {
      closeEducationTypeForm();
      loadEducationTypes();
    });
  } else {
    // הוספת רשומה חדשה
    ref.push({ Title: title }).then(() => {
      closeEducationTypeForm();
      loadEducationTypes();
    });
  }
}

function deleteEducationType(key) {
  if (confirm("למחוק את סוג החינוך?")) {
    firebase.database().ref("education_types/" + key).remove().then(() => {
      loadEducationTypes();
    });
  }
}

function closeEducationTypeForm() {
  document.getElementById("educationTypeModal").style.display = "none";
}

window.loadEducationTypes = loadEducationTypes;
