
function loadInstructors() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Instructors</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openInstructorForm()">➕ הוסף מדריך</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>First</th><th>Last</th><th>Email</th><th>Mobile</th><th>Role</th><th>Actions</th></tr></thead>
      <tbody id="instructors-body"></tbody>
    </table>
    <div id="instructorModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeInstructorForm()">&times;</span>
        <h3 id="instructorFormTitle">הוסף מדריך</h3>
        <input type="text" id="instructorId" placeholder="תעודת זהות">
        <input type="text" id="instructorFirst" placeholder="שם פרטי">
        <input type="text" id="instructorLast" placeholder="שם משפחה">
        <input type="email" id="instructorEmail" placeholder="דוא"ל">
        <input type="text" id="instructorMobile" placeholder="טלפון נייד">
        <input type="text" id="instructorRole" placeholder="תפקיד">
        <button onclick="saveInstructor()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("instructors-body");
  db.ref("instructors").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.first_name}</td>
          <td>${d.last_name}</td>
          <td>${d.email}</td>
          <td>${d.mobile}</td>
          <td>${d.role}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editInstructor('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteInstructor('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openInstructorForm() {
  document.getElementById("instructorFormTitle").textContent = "הוסף מדריך";
  document.getElementById("instructorId").disabled = false;
  document.getElementById("instructorId").value = "";
  document.getElementById("instructorFirst").value = "";
  document.getElementById("instructorLast").value = "";
  document.getElementById("instructorEmail").value = "";
  document.getElementById("instructorMobile").value = "";
  document.getElementById("instructorRole").value = "";
  document.getElementById("instructorModal").style.display = "block";
}

function editInstructor(id) {
  db.ref("instructors/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("instructorFormTitle").textContent = "ערוך מדריך";
    document.getElementById("instructorId").value = id;
    document.getElementById("instructorId").disabled = true;
    document.getElementById("instructorFirst").value = data.first_name;
    document.getElementById("instructorLast").value = data.last_name;
    document.getElementById("instructorEmail").value = data.email;
    document.getElementById("instructorMobile").value = data.mobile;
    document.getElementById("instructorRole").value = data.role;
    document.getElementById("instructorModal").style.display = "block";
  });
}

function saveInstructor() {
  const id = document.getElementById("instructorId").value;
  const first = document.getElementById("instructorFirst").value;
  const last = document.getElementById("instructorLast").value;
  const email = document.getElementById("instructorEmail").value;
  const mobile = document.getElementById("instructorMobile").value;
  const role = document.getElementById("instructorRole").value;

  if (id && first && last) {
    db.ref("instructors/" + id).set({ first_name: first, last_name: last, email, mobile, role });
    closeInstructorForm();
    loadInstructors();
  } else {
    alert("יש למלא לפחות תעודת זהות, שם פרטי ושם משפחה");
  }
}

function deleteInstructor(id) {
  if (confirm("למחוק את המדריך?")) {
    db.ref("instructors/" + id).remove();
    loadInstructors();
  }
}

function closeInstructorForm() {
  document.getElementById("instructorModal").style.display = "none";
}

window.loadInstructors = loadInstructors;
