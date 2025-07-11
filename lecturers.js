
function loadLecturers() {
  console.log("loadLecturers triggered");

  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");

  if (!container) {
    console.error("Missing #table-container element");
    return;
  }

  container.innerHTML = "<h2>Lecturers</h2><table id='lecturers-table' class='data-table'><thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Mobile</th><th>Actions</th></tr></thead><tbody></tbody></table>";

  const tableBody = document.querySelector("#lecturers-table tbody");

  if (typeof db === "undefined") {
    console.error("Firebase database (db) is not defined");
    return;
  }

  db.ref("lecturers").once("value")
    .then(snapshot => {
      tableBody.innerHTML = "";
      if (!snapshot.exists()) {
        console.warn("No lecturers found in database.");
        tableBody.innerHTML = "<tr><td colspan='6'>No data available</td></tr>";
        return;
      }

      snapshot.forEach(child => {
        const id = child.key;
        const data = child.val();
        console.log("Lecturer:", id, data);

        const row = `<tr>
          <td>${id}</td>
          <td>${data.first_name || ""}</td>
          <td>${data.last_name || ""}</td>
          <td>${data.email || ""}</td>
          <td>${data.mobile || ""}</td>
          <td>
            ${userType === "admin" || userType === "operator" ? `<button onclick="editLecturer('${id}')">Edit</button>` : ""}
            ${userType === "admin" ? `<button onclick="deleteLecturer('${id}')">Delete</button>` : ""}
          </td>
        </tr>`;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error("Error loading lecturers:", error);
    });
}
