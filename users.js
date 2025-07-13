
function loadUsers() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Users</h2>
    ${userType === "admin" ? '<button onclick="openUserForm()">➕ הוסף משתמש</button>' : ""}
    <table class="data-table">
      <thead><tr><th>User ID</th><th>User Type</th><th>Actions</th></tr></thead>
      <tbody id="users-body"></tbody>
    </table>
    <div id="userModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeUserForm()">&times;</span>
        <h3 id="userFormTitle">הוסף משתמש</h3>
        <input type="text" id="userId" placeholder="קוד משתמש">
        <select id="userTypeSelect">
          <option value="">בחר סוג משתמש</option>
          <option value="admin">Admin</option>
          <option value="operator">Operator</option>
          <option value="client">Client</option>
          <option value="guest">Guest</option>
        </select>
        <button onclick="saveUser()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("users-body");
  db.ref("users").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.user_type}</td>
          <td>
            ${userType === "admin" ? `<button onclick="editUser('${id}')">✎</button>` : ""}
            ${userType === "admin" ? `<button onclick="deleteUser('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openUserForm() {
  document.getElementById("userFormTitle").textContent = "הוסף משתמש";
  document.getElementById("userId").disabled = false;
  document.getElementById("userId").value = "";
  document.getElementById("userTypeSelect").value = "";
  document.getElementById("userModal").style.display = "block";
}

function editUser(id) {
  db.ref("users/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("userFormTitle").textContent = "ערוך משתמש";
    document.getElementById("userId").value = id;
    document.getElementById("userId").disabled = true;
    document.getElementById("userTypeSelect").value = data.user_type;
    document.getElementById("userModal").style.display = "block";
  });
}

function saveUser() {
  const id = document.getElementById("userId").value;
  const userType = document.getElementById("userTypeSelect").value;

  if (id && userType) {
    db.ref("users/" + id).set({ user_type: userType });
    closeUserForm();
    loadUsers();
  } else {
    alert("יש למלא גם קוד וגם סוג משתמש");
  }
}

function deleteUser(id) {
  if (confirm("למחוק את המשתמש?")) {
    db.ref("users/" + id).remove();
    loadUsers();
  }
}

function closeUserForm() {
  document.getElementById("userModal").style.display = "none";
}

window.loadUsers = loadUsers;
