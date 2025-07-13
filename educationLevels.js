function loadEducationLevels() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Education Levels</h2>
    ${(userType === "admin" || userType === "operator") ? '<button onclick="openEducationLevelForm()">➕ הוסף שלב חינוכי</button>' : ""}
    <table class="data-table">
      <thead><tr><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="education-levels-body"></tbody>
    </table>
    <div id="educationLevelModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeEducationLevelForm()">&times;</span>
        <h3 id="educationLevelFormTitle">הוסף שלב חינוכי</h3>
        <input type="hidden" id="educationLevelKey">
        <input type="text" id="educationLevelTitle" placeholder="כותרת שלב חינוכי">
        <button onclick="saveEducationLevel()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("education-levels-body");
  firebase.database().ref("education_levels").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const key = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${d.Title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editEducationLevel('${key}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteEducationLevel('${key}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openEducationLevelForm() {
  document.getElementById("educationLevelFormTitle").textContent = "הוסף שלב חינוכי";
  document.getElementById("educationLevelKey").value = "";
  document.getElementById("educationLevelTitle").value = "";
  document.getElementById("educationLevelModal").style.display = "block";
}

function editEducationLevel(key) {
  firebase.database().ref("education_levels/" + key).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("educationLevelFormTitle").textContent = "ערוך שלב חינוכי";
    document.getElementById("educationLevelKey").value = key;
    document.getElementById("educationLevelTitle").value = data.Title;
    document.getElementById("educationLevelModal").style.display = "block";
  });
}

function saveEducationLevel() {
  const key = document.getElementById("educationLevelKey").value;
  const title = document.getElementById("educationLevelTitle").value;

  if (!title.trim()) {
    alert("יש להזין כותרת שלב חינוכי");
    return;
  }

  const ref = firebase.database().ref("education_levels");

  if (key) {
    // עדכון
    ref.child(key).update({ Title: title }).then(() => {
      closeEducationLevelForm();
      loadEducationLevels();
    });
  } else {
    // הוספה
    ref.push({ Title: title }).then(() => {
      closeEducationLevelForm();
      loadEducationLevels();
    });
  }
}

function deleteEducationLevel(key) {
  if (confirm("למחוק את שלב החינוך?")) {
    firebase.database().ref("education_levels/" + key).remove().then(() => {
      loadEducationLevels();
    });
  }
}

function closeEducationLevelForm() {
  document.getElementById("educationLevelModal").style.display = "none";
}

window.loadEducationLevels = loadEducationLevels;
