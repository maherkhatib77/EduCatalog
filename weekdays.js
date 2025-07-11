
function loadWeekdays() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Weekdays</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openWeekdayForm()">➕ הוסף יום</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead>
      <tbody id="weekdays-body"></tbody>
    </table>
    <div id="weekdayModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeWeekdayForm()">&times;</span>
        <h3 id="weekdayFormTitle">הוסף יום</h3>
        <input type="text" id="weekdayId" placeholder="קוד יום">
        <input type="text" id="weekdayName" placeholder="שם יום">
        <button onclick="saveWeekday()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("weekdays-body");
  db.ref("weekdays").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.name}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editWeekday('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteWeekday('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openWeekdayForm() {
  document.getElementById("weekdayFormTitle").textContent = "הוסף יום";
  document.getElementById("weekdayId").disabled = false;
  document.getElementById("weekdayId").value = "";
  document.getElementById("weekdayName").value = "";
  document.getElementById("weekdayModal").style.display = "block";
}

function editWeekday(id) {
  db.ref("weekdays/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("weekdayFormTitle").textContent = "ערוך יום";
    document.getElementById("weekdayId").value = id;
    document.getElementById("weekdayId").disabled = true;
    document.getElementById("weekdayName").value = data.name;
    document.getElementById("weekdayModal").style.display = "block";
  });
}

function saveWeekday() {
  const id = document.getElementById("weekdayId").value;
  const name = document.getElementById("weekdayName").value;

  if (id && name) {
    db.ref("weekdays/" + id).set({ name });
    closeWeekdayForm();
    loadWeekdays();
  } else {
    alert("יש למלא גם קוד וגם שם");
  }
}

function deleteWeekday(id) {
  if (confirm("למחוק את היום?")) {
    db.ref("weekdays/" + id).remove();
    loadWeekdays();
  }
}

function closeWeekdayForm() {
  document.getElementById("weekdayModal").style.display = "none";
}

window.loadWeekdays = loadWeekdays;
