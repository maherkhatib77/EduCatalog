
function loadSolutionDomains() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Solution Domains</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openSolutionDomainForm()">➕ הוסף תחום פתרון</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>Domain</th><th>Actions</th></tr></thead>
      <tbody id="solution-domains-body"></tbody>
    </table>
    <div id="solutionDomainModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeSolutionDomainForm()">&times;</span>
        <h3 id="solutionDomainFormTitle">הוסף תחום פתרון</h3>
        <input type="text" id="solutionDomainId" placeholder="קוד תחום">
        <input type="text" id="solutionDomainName" placeholder="שם תחום פתרון">
        <button onclick="saveSolutionDomain()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("solution-domains-body");
  db.ref("solution_domains").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.name}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editSolutionDomain('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteSolutionDomain('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openSolutionDomainForm() {
  document.getElementById("solutionDomainFormTitle").textContent = "הוסף תחום פתרון";
  document.getElementById("solutionDomainId").disabled = false;
  document.getElementById("solutionDomainId").value = "";
  document.getElementById("solutionDomainName").value = "";
  document.getElementById("solutionDomainModal").style.display = "block";
}

function editSolutionDomain(id) {
  db.ref("solution_domains/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("solutionDomainFormTitle").textContent = "ערוך תחום פתרון";
    document.getElementById("solutionDomainId").value = id;
    document.getElementById("solutionDomainId").disabled = true;
    document.getElementById("solutionDomainName").value = data.name;
    document.getElementById("solutionDomainModal").style.display = "block";
  });
}

function saveSolutionDomain() {
  const id = document.getElementById("solutionDomainId").value;
  const name = document.getElementById("solutionDomainName").value;

  if (id && name) {
    db.ref("solution_domains/" + id).set({ name });
    closeSolutionDomainForm();
    loadSolutionDomains();
  } else {
    alert("יש למלא גם קוד וגם שם התחום");
  }
}

function deleteSolutionDomain(id) {
  if (confirm("למחוק את תחום הפתרון?")) {
    db.ref("solution_domains/" + id).remove();
    loadSolutionDomains();
  }
}

function closeSolutionDomainForm() {
  document.getElementById("solutionDomainModal").style.display = "none";
}

window.loadSolutionDomains = loadSolutionDomains;
