
function loadInstructors() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = "<h2>Instructors</h2><table id='instructors-table' class='data-table'><thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Mobile</th><th>Role</th><th>Actions</th></tr></thead><tbody></tbody></table>";

  const tableBody = document.querySelector("#instructors-table tbody");
  db.ref("instructors").once("value", (snapshot) => {
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
        <td>${data.role || ""}</td>
        <td>${userType === "admin" || userType === "operator" ? `<button onclick="editInstructor('${id}')">Edit</button>` : ""}
            ${userType === "admin" ? `<button onclick="deleteInstructor('${id}')">Delete</button>` : ""}</td>
      </tr>`;
      tableBody.innerHTML += row;
    });
  });
}
