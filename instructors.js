
function loadInstructors() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Instructors</h2>
    <button onclick="addInstructor()">➕ הוסף מדריך</button>
    <table class="data-table">
      <thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Mobile</th><th>Role</th><th>Actions</th></tr></thead>
      <tbody id="instructors-body"></tbody>
    </table>`;

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
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editInstructor('${id}')">Edit</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteInstructor('${id}')">Delete</button>` : ""}
          </td>
        </tr>`;
    });
  });
}
function addInstructor() {
  const id = prompt("Enter ID");
  const first = prompt("First name");
  const last = prompt("Last name");
  const email = prompt("Email");
  const mobile = prompt("Mobile");
  const role = prompt("Role");
  if (id) {
    db.ref("instructors/" + id).set({ first_name: first, last_name: last, email, mobile, role });
    loadInstructors();
  }
}
function editInstructor(id) {
  const ref = db.ref("instructors/" + id);
  ref.once("value").then(snap => {
    const data = snap.val();
    const first = prompt("Edit first name", data.first_name);
    const last = prompt("Edit last name", data.last_name);
    const email = prompt("Edit email", data.email);
    const mobile = prompt("Edit mobile", data.mobile);
    const role = prompt("Edit role", data.role);
    ref.set({ first_name: first, last_name: last, email, mobile, role });
    loadInstructors();
  });
}
function deleteInstructor(id) {
  if (confirm("Delete instructor?")) {
    db.ref("instructors/" + id).remove();
    loadInstructors();
  }
}
window.loadInstructors = loadInstructors;
