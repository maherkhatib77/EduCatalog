
function loadLecturers() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Lecturers</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openLecturerForm()">➕ הוסף מרצה</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>First</th><th>Last</th><th>Email</th><th>Mobile</th><th>Actions</th></tr></thead>
      <tbody id="lecturers-body"></tbody>
    </table>
    <div id="lecturerModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeLecturerForm()">&times;</span>
        <h3 id="lecturerFormTitle">הוסף מרצה</h3>
        <input type="text" id="lecturerId" placeholder="תעודת זהות">
        <input type="text" id="lecturerFirst" placeholder="שם פרטי">
        <input type="text" id="lecturerLast" placeholder="שם משפחה">
        <input type="email" id="lecturerEmail" placeholder="דוא"ל">
        <input type="text" id="lecturerMobile" placeholder="טלפון נייד">
        <button onclick="saveLecturer()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("lecturers-body");
  db.ref("lecturers").once("value", snapshot => {
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
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editLecturer('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteLecturer('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openLecturerForm() {
  document.getElementById("lecturerFormTitle").textContent = "הוסף מרצה";
  document.getElementById("lecturerId").disabled = false;
  document.getElementById("lecturerId").value = "";
  document.getElementById("lecturerFirst").value = "";
  document.getElementById("lecturerLast").value = "";
  document.getElementById("lecturerEmail").value = "";
  document.getElementById("lecturerMobile").value = "";
  document.getElementById("lecturerModal").style.display = "block";
}

function editLecturer(id) {
  db.ref("lecturers/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("lecturerFormTitle").textContent = "ערוך מרצה";
    document.getElementById("lecturerId").value = id;
    document.getElementById("lecturerId").disabled = true;
    document.getElementById("lecturerFirst").value = data.first_name;
    document.getElementById("lecturerLast").value = data.last_name;
    document.getElementById("lecturerEmail").value = data.email;
    document.getElementById("lecturerMobile").value = data.mobile;
    document.getElementById("lecturerModal").style.display = "block";
  });
}

function saveLecturer() {
  const id = document.getElementById("lecturerId").value;
  const first = document.getElementById("lecturerFirst").value;
  const last = document.getElementById("lecturerLast").value;
  const email = document.getElementById("lecturerEmail").value;
  const mobile = document.getElementById("lecturerMobile").value;

  if (id && first && last) {
    db.ref("lecturers/" + id).set({ first_name: first, last_name: last, email, mobile });
    closeLecturerForm();
    loadLecturers();
  } else {
    alert("יש למלא לפחות תעודת זהות, שם פרטי ושם משפחה");
  }
}

function deleteLecturer(id) {
  if (confirm("למחוק את המרצה?")) {
    db.ref("lecturers/" + id).remove();
    loadLecturers();
  }
}

function closeLecturerForm() {
  document.getElementById("lecturerModal").style.display = "none";
}

window.loadLecturers = loadLecturers;
