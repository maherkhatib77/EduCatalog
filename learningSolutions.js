
function loadLearningSolutions() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");

  container.innerHTML = `
    <h2>Learning Solutions</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openLearningSolutionForm()">➕ הוסף פתרון למידה</button>' : ""}
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Creator</th><th>Date</th><th>Levels</th><th>Types</th><th>Hours</th><th>Subject</th><th>Mode</th><th>Actions</th>
        </tr>
      </thead>
      <tbody id="learning-solutions-body"></tbody>
    </table>

    <div id="learningSolutionModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="closeLearningSolutionForm()">&times;</span>
        <h3 id="learningSolutionFormTitle">הוסף פתרון למידה</h3>
        <input type="text" id="solutionId" placeholder="מספר פתרון">
        <input type="text" id="solutionName" placeholder="שם פתרון למידה">
        <input type="text" id="creatorName" placeholder="שם יוצר">
        <input type="date" id="firstMeetingDate">
        <input type="time" id="startTime">
        <input type="time" id="endTime">
        <input type="text" id="weekday" placeholder="יום בשבוע">
        <input type="text" id="educationLevels" placeholder="שלבי חינוך (מופרדים בפסיקים)">
        <input type="text" id="educationTypes" placeholder="סוגי חינוך (מופרדים בפסיקים)">
        <input type="number" id="hoursCount" placeholder="שעות אקדמיות">
        <input type="text" id="subject" placeholder="תחום דעת">
        <input type="text" id="solutionDomain" placeholder="תחום פתרון למידה">
        <input type="text" id="learningMode" placeholder="אופן למידה">
        <input type="url" id="syllabusLink" placeholder="קישור לסילבוס">
        <textarea id="summary" placeholder="תקציר פתרון למידה"></textarea>
        <textarea id="objectives" placeholder="מטרות פתרון למידה"></textarea>
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
          <td>${(d.education_levels || []).join(", ")}</td>
          <td>${(d.education_types || []).join(", ")}</td>
          <td>${d.hours_count || ""}</td>
          <td>${d.subject || ""}</td>
          <td>${d.learning_mode || ""}</td>
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
  const fields = ["solutionId", "solutionName", "creatorName", "firstMeetingDate", "startTime", "endTime", "weekday",
                  "educationLevels", "educationTypes", "hoursCount", "subject", "solutionDomain", "learningMode", 
                  "syllabusLink", "summary", "objectives"];
  fields.forEach(id => document.getElementById(id).value = "");
  document.getElementById("learningSolutionModal").style.display = "block";
}

function editLearningSolution(id) {
  db.ref("learning_solutions/" + id).once("value").then(snap => {
    const d = snap.val();
    document.getElementById("learningSolutionFormTitle").textContent = "ערוך פתרון למידה";
    document.getElementById("solutionId").value = id;
    document.getElementById("solutionId").disabled = true;
    document.getElementById("solutionName").value = d.solution_name || "";
    document.getElementById("creatorName").value = d.creator_name || "";
    document.getElementById("firstMeetingDate").value = d.first_meeting_date || "";
    document.getElementById("startTime").value = d.start_time || "";
    document.getElementById("endTime").value = d.end_time || "";
    document.getElementById("weekday").value = d.weekday || "";
    document.getElementById("educationLevels").value = (d.education_levels || []).join(", ");
    document.getElementById("educationTypes").value = (d.education_types || []).join(", ");
    document.getElementById("hoursCount").value = d.hours_count || "";
    document.getElementById("subject").value = d.subject || "";
    document.getElementById("solutionDomain").value = d.solution_domain || "";
    document.getElementById("learningMode").value = d.learning_mode || "";
    document.getElementById("syllabusLink").value = d.syllabus_link || "";
    document.getElementById("summary").value = d.summary || "";
    document.getElementById("objectives").value = d.objectives || "";
    document.getElementById("learningSolutionModal").style.display = "block";
  });
}

function saveLearningSolution() {
  const id = document.getElementById("solutionId").value;
  const data = {
    solution_name: document.getElementById("solutionName").value,
    creator_name: document.getElementById("creatorName").value,
    first_meeting_date: document.getElementById("firstMeetingDate").value,
    start_time: document.getElementById("startTime").value,
    end_time: document.getElementById("endTime").value,
    weekday: document.getElementById("weekday").value,
    education_levels: document.getElementById("educationLevels").value.split(",").map(s => s.trim()),
    education_types: document.getElementById("educationTypes").value.split(",").map(s => s.trim()),
    hours_count: parseInt(document.getElementById("hoursCount").value),
    subject: document.getElementById("subject").value,
    solution_domain: document.getElementById("solutionDomain").value,
    learning_mode: document.getElementById("learningMode").value,
    syllabus_link: document.getElementById("syllabusLink").value,
    summary: document.getElementById("summary").value,
    objectives: document.getElementById("objectives").value
  };
  if (id && data.solution_name && data.first_meeting_date) {
    db.ref("learning_solutions/" + id).set(data);
    closeLearningSolutionForm();
    loadLearningSolutions();
  } else {
    alert("שדות חובה: מספר פתרון, שם, תאריך");
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
