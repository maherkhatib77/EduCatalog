
function loadLecturers() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Lecturers</h2>
    <button onclick="addLecturer()">➕ הוסף מרצה</button>
    <table class="data-table">
      <thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Mobile</th><th>Actions</th></tr></thead>
      <tbody id="lecturers-body"></tbody>
    </table>`;

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
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editLecturer('${id}')">Edit</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteLecturer('${id}')">Delete</button>` : ""}
          </td>
        </tr>`;
    });
  });
}
function addLecturer() {
  const id = prompt("Enter ID");
  const first = prompt("First name");
  const last = prompt("Last name");
  const email = prompt("Email");
  const mobile = prompt("Mobile");
  if (id) {
    db.ref("lecturers/" + id).set({ first_name: first, last_name: last, email, mobile });
    loadLecturers();
  }
}
function editLecturer(id) {
  const ref = db.ref("lecturers/" + id);
  ref.once("value").then(snap => {
    const data = snap.val();
    const first = prompt("Edit first name", data.first_name);
    const last = prompt("Edit last name", data.last_name);
    const email = prompt("Edit email", data.email);
    const mobile = prompt("Edit mobile", data.mobile);
    ref.set({ first_name: first, last_name: last, email, mobile });
    loadLecturers();
  });
}
function deleteLecturer(id) {
  if (confirm("Delete lecturer?")) {
    db.ref("lecturers/" + id).remove();
    loadLecturers();
  }
}
window.loadLecturers = loadLecturers;
