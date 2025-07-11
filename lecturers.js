
function loadLecturers() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = "<h2>Lecturers</h2><table id='lecturers-table' class='data-table'><thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Mobile</th><th>Actions</th></tr></thead><tbody></tbody></table>";

  const tableBody = document.querySelector("#lecturers-table tbody");
  db.ref("lecturers").once("value", (snapshot) => {
    tableBody.innerHTML = "";
    snapshot.forEach((child) => {
      const id = child.key;
      const data = child.val();
      const row = `<tr>
        <td>${id}</td>
        <td>${data.first_name || ""}</td>
        <td>${data.last_name || ""}</td>
        <td>${data.email || ""}</td>
        <td>${data.mobile || ""}</td>
        <td>${userType === "admin" || userType === "operator" ? `<button onclick="editLecturer('${id}')">Edit</button>` : ""}
            ${userType === "admin" ? `<button onclick="deleteLecturer('${id}')">Delete</button>` : ""}</td>
      </tr>`;
      tableBody.innerHTML += row;
    });
  });
}
