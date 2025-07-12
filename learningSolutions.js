function loadLearningSolutions() {
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("table-container");

  container.innerHTML = `
    <h2>Learning Solutions</h2>
    ${userType === "admin" || userType === "operator" ? '<button onclick="openLearningSolutionForm()">➕ הוסף פתרון למידה</button>' : ""}
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th><th>Creator</th><th>Date</th><th>Weekday</th><th>Levels</th><th>Hours</th><th>Subject</th><th>Actions</th>
        </tr>
      </thead>
      <tbody id="learning-solutions-body"></tbody>
    </table>

    <div id="learningSolutionModal" class="modal">
      <div class="modal-content scrollable-form">
        <span class="close" onclick="closeLearningSolutionForm()">&times;</span>
        <h3 id="learningSolutionFormTitle">הוסף פתרון למידה</h3>
        <input type="text" id="solutionId" placeholder="מספר פתרון למידה">
        <input type="text" id="solutionName" placeholder="שם פתרון למידה">
        <select id="creatorName"></select>
        <input type="date" id="firstMeetingDate">
        <input type="time" id="startTime">
        <input type="time" id="endTime">
        <select id="weekday"></select>
        <select id="educationLevels" multiple></select>
        <select id="educationTypes" multiple></select>
        <select id="hoursCount"></select>
        <select id="subject"></select>
        <select id="solutionDomain"></select>
        <select id="learningMode"></select>
        <input type="url" id="syllabusLink" placeholder="קישור לסילבוס">
        <textarea id="summary" placeholder="תקציר פתרון הלמידה"></textarea>
        <textarea id="objectives" placeholder="מטרות פתרון הלמידה"></textarea>
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
          <td>${d.solution_name || ""}</td>
          <td>${d.creator_name || ""}</td>
          <td>${d.first_meeting_date || ""}</td>
          <td>${d.weekday || ""}</td>
          <td>${(d.education_levels || []).join(", ")}</td>
          <td>${d.hours_count || ""}</td>
          <td>${d.subject || ""}</td>
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
  const ids = ["solutionId","solutionName","firstMeetingDate","startTime","endTime","syllabusLink","summary","objectives"];
  ids.forEach(id => document.getElementById(id).value = "");
  ["creatorName","weekday","educationLevels","educationTypes","hoursCount","subject","solutionDomain","learningMode"]
    .forEach(id => document.getElementById(id).innerHTML = "");
  populateAllDropdowns();
  document.getElementById("learningSolutionModal").style.display = "block";
}

function editLearningSolution(id) {
  db.ref("learning_solutions/" + id).once("value").then(snap => {
    const d = snap.val();
    document.getElementById("learningSolutionFormTitle").textContent = "ערוך פתרון למידה";
    document.getElementById("solutionId").value = id;
    document.getElementById("solutionId").disabled = true;
    document.getElementById("solutionName").value = d.solution_name || "";
    document.getElementById("firstMeetingDate").value = d.first_meeting_date || "";
    document.getElementById("startTime").value = d.start_time || "";
    document.getElementById("endTime").value = d.end_time || "";
    document.getElementById("syllabusLink").value = d.syllabus_link || "";
    document.getElementById("summary").value = d.summary || "";
    document.getElementById("objectives").value = d.objectives || "";
    populateAllDropdowns();
    setTimeout(() => {
      document.getElementById("creatorName").value = d.creator_name || "";
      document.getElementById("weekday").value = d.weekday || "";
      document.getElementById("hoursCount").value = d.hours_count || "";
      document.getElementById("subject").value = d.subject || "";
      document.getElementById("solutionDomain").value = d.solution_domain || "";
      document.getElementById("learningMode").value = d.learning_mode || "";
    }, 300);
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
    education_levels: Array.from(document.getElementById("educationLevels").selectedOptions).map(o => o.value),
    education_types: Array.from(document.getElementById("educationTypes").selectedOptions).map(o => o.value),
    hours_count: document.getElementById("hoursCount").value,
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

// Drop-down dynamic population
function populateSelect(selectId, path, field = "title", multi = false) {
  const select = document.getElementById(selectId);
  select.innerHTML = multi ? "" : "<option value=''>בחר</option>";
  db.ref(path).once("value", snapshot => {
    snapshot.forEach(child => {
      const key = child.key;
      const data = child.val();
      const label = data[field] || key;
      const option = document.createElement("option");
      option.value = key;
      option.textContent = label;
      select.appendChild(option);
    });
  });
}

function populateAllDropdowns() {
  populateSelect("creatorName", "instructors", "first_name");
  populateSelect("weekday", "weekdays", "name");
  populateSelect("educationLevels", "education_levels", "title", true);
  populateSelect("educationTypes", "education_types", "title", true);
  populateSelect("hoursCount", "hour_credits", "hours");
  populateSelect("subject", "subjects", "name");
  populateSelect("solutionDomain", "solution_domains", "name");
  populateSelect("learningMode", "learning_modes", "title");
}

window.loadLearningSolutions = loadLearningSolutions;


// -------------------- תצוגת כרטיסים --------------------
let currentCardIndex = 0;
let cardDataArray = [];

function loadLearningSolutionsAsCards() {
  const container = document.getElementById("card-container");
  const userType = localStorage.getItem("userType");

  db.ref("learning_solutions").once("value", snapshot => {
    cardDataArray = [];
    snapshot.forEach(child => {
      const item = child.val();
      item.id = child.key;
      cardDataArray.push(item);
    });

    if (cardDataArray.length > 0) {
      currentCardIndex = 0;
      renderCardView();
    } else {
      container.innerHTML = "<p>אין נתונים להצגה.</p>";
    }
  });
}

function renderCardView() {
  const d = cardDataArray[currentCardIndex];
  const userType = localStorage.getItem("userType");
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  let html = '<div style="border:2px solid #1976d2; border-radius:12px; padding:20px; background:#f9f9f9;">';
  html += `<h3 style="margin-top:0;">${d.solution_name || "(ללא שם)"}</h3>`;
  html += `<p><strong>מנחה:</strong> ${d.creator_name || ""}</p>`;
  html += `<p><strong>תאריך:</strong> ${d.first_meeting_date || ""}</p>`;
  html += `<p><strong>יום:</strong> ${d.weekday || ""}</p>`;
  html += `<p><strong>שלבים:</strong> ${(d.education_levels || []).join(", ")}</p>`;
  html += `<p><strong>שעות:</strong> ${d.hours_count || ""}</p>`;
  html += `<p><strong>תחום דעת:</strong> ${d.subject || ""}</p>`;
  html += `<p><strong>מטרות:</strong> ${d.objectives || ""}</p>`;
  html += `<p><strong>תקציר:</strong> ${d.summary || ""}</p>`;

  html += `<div style="margin-top:10px;">`;
  html += `<button onclick="prevCard()" ${currentCardIndex === 0 ? "disabled" : ""}>◀</button>`;
  html += ` ${currentCardIndex + 1} / ${cardDataArray.length} `;
  html += `<button onclick="nextCard()" ${currentCardIndex === cardDataArray.length - 1 ? "disabled" : ""}>▶</button>`;
  html += `</div>`;

  if (userType === "admin" || userType === "operator") {
    html += `<div style="margin-top:15px;">`;
    html += `<button onclick="editLearningSolution('${d.id}')">✎ ערוך</button> `;
    if (userType === "admin") {
      html += `<button onclick="deleteLearningSolution('${d.id}')">🗑 מחק</button>`;
    }
    html += `</div>`;
  }

  html += "</div>";
  container.innerHTML = html;
}

function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    renderCardView();
  }
}

function nextCard() {
  if (currentCardIndex < cardDataArray.length - 1) {
    currentCardIndex++;
    renderCardView();
  }
}


// חשיפת הפונקציות לכפתורים בדף
window.loadLearningSolutions = loadLearningSolutions;
window.loadLearningSolutionsAsCards = loadLearningSolutionsAsCards;
