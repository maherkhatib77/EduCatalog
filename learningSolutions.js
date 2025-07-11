
function loadLearningSolutions() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");
  container.innerHTML = `
    <h2>Learning Solutions</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openLearningSolutionForm()">➕ הוסף פתרון למידה</button>' : ""}
    <table class="data-table">
      <thead><tr><th>ID</th><th>Name</th><th>Creator</th><th>First Meeting</th><th>Start</th><th>End</th><th>Actions</th></tr></thead>
      <tbody id="learning-solutions-body"></tbody>
    </table>
    <div id="learningSolutionModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeLearningSolutionForm()">&times;</span>
        <h3 id="learningSolutionFormTitle">הוסף פתרון למידה</h3>
        <input type="text" id="solutionId" placeholder="מספר פתרון">
        <input type="text" id="solutionName" placeholder="שם פתרון">
        <input type="text" id="creatorName" placeholder="שם יוצר">
        <input type="date" id="firstMeetingDate" placeholder="תאריך ראשון">
        <input type="time" id="startTime" placeholder="שעת התחלה">
        <input type="time" id="endTime" placeholder="שעת סיום">
        <button onclick="saveLearningSolution()">שמור</button>
      </div>
    </div>
  `;

  const tbody = document.getElementById("learning-solutions-body");
  db.ref("learning_solutions").once("value", snapshot => {
    tbody.innerHTML = "";
    snapshot.forEach(child => {
      const id = child.key;
      const d = child.val();
      tbody.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${d.solution_name || ""}</td>
          <td>${d.creator_name || ""}</td>
          <td>${d.first_meeting_date || ""}</td>
          <td>${d.start_time || ""}</td>
          <td>${d.end_time || ""}</td>
          <td>
            ${(userType === "admin" || userType === "operator") ? `<button onclick="editLearningSolution('${id}')">✎</button>` : ""}
            ${(userType === "admin") ? `<button onclick="deleteLearningSolution('${id}')">🗑</button>` : ""}
          </td>
        </tr>`;
    });
  });
}

function openLearningSolutionForm() {
  document.getElementById("learningSolutionFormTitle").textContent = "הוסף פתרון למידה";
  document.getElementById("solutionId").disabled = false;
  document.getElementById("solutionId").value = "";
  document.getElementById("solutionName").value = "";
  document.getElementById("creatorName").value = "";
  document.getElementById("firstMeetingDate").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  document.getElementById("learningSolutionModal").style.display = "block";
}

function editLearningSolution(id) {
  db.ref("learning_solutions/" + id).once("value").then(snap => {
    const data = snap.val();
    document.getElementById("learningSolutionFormTitle").textContent = "ערוך פתרון למידה";
    document.getElementById("solutionId").value = id;
    document.getElementById("solutionId").disabled = true;
    document.getElementById("solutionName").value = data.solution_name || "";
    document.getElementById("creatorName").value = data.creator_name || "";
    document.getElementById("firstMeetingDate").value = data.first_meeting_date || "";
    document.getElementById("startTime").value = data.start_time || "";
    document.getElementById("endTime").value = data.end_time || "";
    document.getElementById("learningSolutionModal").style.display = "block";
  });
}

function saveLearningSolution() {
  const id = document.getElementById("solutionId").value;
  const name = document.getElementById("solutionName").value;
  const creator = document.getElementById("creatorName").value;
  const date = document.getElementById("firstMeetingDate").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  if (id && name && date) {
    db.ref("learning_solutions/" + id).set({
      solution_name: name,
      creator_name: creator,
      first_meeting_date: date,
      start_time: start,
      end_time: end
    });
    closeLearningSolutionForm();
    loadLearningSolutions();
  } else {
    alert("שדות חובה: מספר פתרון, שם פתרון, תאריך מפגש ראשון");
  }
}

function deleteLearningSolution(id) {
  if (confirm("למחוק את פתרון הלמידה?")) {
    db.ref("learning_solutions/" + id).remove();
    loadLearningSolutions();
  }
}

function closeLearningSolutionForm() {
  document.getElementById("learningSolutionModal").style.display = "none";
}

window.loadLearningSolutions = loadLearningSolutions;
