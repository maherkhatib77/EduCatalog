
function loadHourCredits() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Hour Credits</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openHourCreditForm()">➕ הוסף היקף שעות</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>Hours</th><th>Actions</th></tr></thead>
      <tbody id="hour-credits-body"></tbody>
    </table>
    <div id="hourCreditModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeHourCreditForm()">&times;</span>
        <h3 id="hourCreditFormTitle">הוסף היקף שעות</h3>
        <input type="text" id="hourCreditId" placeholder="קוד היקף שעות">
        <input type="number" id="hourCreditValue" placeholder="היקף שעות">
        <button onclick="saveHourCredit()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("hour-credits-body");
  db.ref("hour_credits").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.hours}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editHourCredit('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteHourCredit('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openHourCreditForm() {
  document.getElementById("hourCreditFormTitle").textContent = "הוסף היקף שעות";
  document.getElementById("hourCreditId").disabled = false;
  document.getElementById("hourCreditId").value = "";
  document.getElementById("hourCreditValue").value = "";
  document.getElementById("hourCreditModal").style.display = "block";
}

function editHourCredit(id) {
  db.ref("hour_credits/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("hourCreditFormTitle").textContent = "ערוך היקף שעות";
    document.getElementById("hourCreditId").value = id;
    document.getElementById("hourCreditId").disabled = true;
    document.getElementById("hourCreditValue").value = data.hours;
    document.getElementById("hourCreditModal").style.display = "block";
  });
}

function saveHourCredit() {
  const id = document.getElementById("hourCreditId").value;
  const hours = parseInt(document.getElementById("hourCreditValue").value);

  if (id && hours) {
    db.ref("hour_credits/" + id).set({ hours });
    closeHourCreditForm();
    loadHourCredits();
  } else {
    alert("יש למלא גם קוד וגם ערך מספרי");
  }
}

function deleteHourCredit(id) {
  if (confirm("למחוק את היקף השעות?")) {
    db.ref("hour_credits/" + id).remove();
    loadHourCredits();
  }
}

function closeHourCreditForm() {
  document.getElementById("hourCreditModal").style.display = "none";
}

window.loadHourCredits = loadHourCredits;
