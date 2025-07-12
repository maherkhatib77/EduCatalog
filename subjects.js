function loadSubjects() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Subjects</h2>
    ${(userType === "admin" || userType === "operator") ? '<button onclick="openSubjectForm()">➕ הוסף מקצוע</button>' : ""}
    <table class="data-table">
      <thead><tr><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="subjects-body"></tbody>
    </table>
    <div id="subjectModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeSubjectForm()">&times;</span>
        <h3 id="subjectFormTitle">הוסף מקצוע</h3>
        <input type="hidden" id="subjectKey">
        <input type="text" id="subjectTitle" placeholder="כותרת מקצוע">
        <button onclick="saveSubject()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("subjects-body");
  firebase.database().ref("subjects").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const key = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${d.Title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editSubject('${key}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteSubject('${key}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openSubjectForm() {
  document.getElementById("subjectFormTitle").textContent = "הוסף מקצוע";
  document.getElementById("subjectKey").value = "";
  document.getElementById("subjectTitle").value = "";
  document.getElementById("subjectModal").style.display = "block";
}

function editSubject(key) {
  firebase.database().ref("subjects/" + key).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("subjectFormTitle").textContent = "ערוך מקצוע";
    document.getElementById("subjectKey").value = key;
    document.getElementById("subjectTitle").value = data.Title;
    document.getElementById("subjectModal").style.display = "block";
  });
}

function saveSubject() {
  const key = document.getElementById("subjectKey").value;
  const title = document.getElementById("subjectTitle").value;

  if (!title.trim()) {
    alert("יש להזין כותרת מקצוע");
    return;
  }

  const ref = firebase.database().ref("subjects");

  if (key) {
    // עדכון רשומה קיימת
    ref.child(key).update({ Title: title }).then(() => {
      closeSubjectForm();
      loadSubjects();
    });
  } else {
    // הוספת רשומה חדשה
    ref.push({ Title: title }).then(() => {
      closeSubjectForm();
      loadSubjects();
    });
  }
}

function deleteSubject(key) {
  if (confirm("למחוק את המקצוע?")) {
    firebase.database().ref("subjects/" + key).remove().then(() => {
      loadSubjects();
    });
  }
}

function closeSubjectForm() {
  document.getElementById("subjectModal").style.display = "none";
}

window.loadSubjects = loadSubjects;
