function loadSolutionDomains() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Solution Domains</h2>
    ${(userType === "admin" || userType === "operator") ? '<button onclick="openSolutionDomainForm()">➕ הוסף תחום פתרון</button>' : ""}
    <table class="data-table">
      <thead><tr><th>Title</th><th>Actions</th></tr></thead>
      <tbody id="solution-domains-body"></tbody>
    </table>
    <div id="solutionDomainModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeSolutionDomainForm()">&times;</span>
        <h3 id="solutionDomainFormTitle">הוסף תחום פתרון</h3>
        <input type="hidden" id="solutionDomainKey">
        <input type="text" id="solutionDomainTitle" placeholder="כותרת תחום הפתרון">
        <button onclick="saveSolutionDomain()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("solution-domains-body");
  firebase.database().ref("solution_domains").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const key = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${d.Title}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editSolutionDomain('${key}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteSolutionDomain('${key}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openSolutionDomainForm() {
  document.getElementById("solutionDomainFormTitle").textContent = "הוסף תחום פתרון";
  document.getElementById("solutionDomainKey").value = "";
  document.getElementById("solutionDomainTitle").value = "";
  document.getElementById("solutionDomainModal").style.display = "block";
}

function editSolutionDomain(key) {
  firebase.database().ref("solution_domains/" + key).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("solutionDomainFormTitle").textContent = "ערוך תחום פתרון";
    document.getElementById("solutionDomainKey").value = key;
    document.getElementById("solutionDomainTitle").value = data.Title;
    document.getElementById("solutionDomainModal").style.display = "block";
  });
}

function saveSolutionDomain() {
  const key = document.getElementById("solutionDomainKey").value;
  const title = document.getElementById("solutionDomainTitle").value;

  if (!title.trim()) {
    alert("יש להזין כותרת תחום פתרון");
    return;
  }

  const ref = firebase.database().ref("solution_domains");

  if (key) {
    // עדכון
    ref.child(key).update({ Title: title }).then(() => {
      closeSolutionDomainForm();
      loadSolutionDomains();
    });
  } else {
    // הוספה
    ref.push({ Title: title }).then(() => {
      closeSolutionDomainForm();
      loadSolutionDomains();
    });
  }
}

function deleteSolutionDomain(key) {
  if (confirm("למחוק את תחום הפתרון?")) {
    firebase.database().ref("solution_domains/" + key).remove().then(() => {
      loadSolutionDomains();
    });
  }
}

function closeSolutionDomainForm() {
  document.getElementById("solutionDomainModal").style.display = "none";
}

window.loadSolutionDomains = loadSolutionDomains;
