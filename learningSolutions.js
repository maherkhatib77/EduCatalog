
const db = firebase.database();
const learningSolutionsRef = db.ref("learning_solutions");

function loadLearningSolutions() {
  learningSolutionsRef.once("value", (snapshot) => {
    const data = snapshot.val();
    const tableBody = document.getElementById("learningSolutionsTableBody");
    tableBody.innerHTML = "";

    for (let key in data) {
      const item = data[key];

      const row = `
        <tr>
          <td>${item.solution_number || ""}</td>
          <td>${item.solution_name || ""}</td>
          <td>${item.creator_name || ""}</td>
          <td>${item.lecturer_name || ""}</td>
          <td>${item.start_date || ""}</td>
          <td>${item.meeting_day || ""}</td>
          <td>${item.start_time || ""} - ${item.end_time || ""}</td>
          <td>${item.education_levels || ""}</td>
          <td>${item.education_type || ""}</td>
          <td>${item.subject || ""}</td>
          <td>${item.solution_domain || ""}</td>
          <td>${item.learning_mode || ""}</td>
          <td>${item.hour_credits || ""}</td>
          <td>
            <button class="edit-btn" onclick="openEditModal('${key}')">✏️</button>
            <button class="delete-btn" onclick="deleteLearningSolution('${key}')">🗑️</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    }
  });
}

function saveLearningSolution() {
  const id = document.getElementById("solutionId").value || generateId();
  const data = {
    solution_number: document.getElementById("solutionNumber").value,
    solution_name: document.getElementById("solutionName").value,
    creator_name: document.getElementById("creatorName").value,
    lecturer_name: document.getElementById("lecturerName").value,
    start_date: document.getElementById("startDate").value,
    meeting_day: document.getElementById("meetingDay").value,
    start_time: document.getElementById("startTime").value,
    end_time: document.getElementById("endTime").value,
    education_levels: document.getElementById("educationLevels").value,
    education_type: document.getElementById("educationType").value,
    subject: document.getElementById("subject").value,
    solution_domain: document.getElementById("solutionDomain").value,
    learning_mode: document.getElementById("learningMode").value,
    hour_credits: document.getElementById("hourCredits").value,
    syllabus_link: document.getElementById("syllabusLink").value,
    solution_summary: document.getElementById("solutionSummary").value,
    solution_goals: document.getElementById("solutionGoals").value,
  };

  learningSolutionsRef.child(id).set(data).then(() => {
    closeModal();
    loadLearningSolutions();
  });
}

function openEditModal(id) {
  learningSolutionsRef.child(id).once("value", (snapshot) => {
    const data = snapshot.val();
    document.getElementById("solutionId").value = id;
    document.getElementById("solutionNumber").value = data.solution_number || "";
    document.getElementById("solutionName").value = data.solution_name || "";
    document.getElementById("creatorName").value = data.creator_name || "";
    document.getElementById("lecturerName").value = data.lecturer_name || "";
    document.getElementById("startDate").value = data.start_date || "";
    document.getElementById("meetingDay").value = data.meeting_day || "";
    document.getElementById("startTime").value = data.start_time || "";
    document.getElementById("endTime").value = data.end_time || "";
    document.getElementById("educationLevels").value = data.education_levels || "";
    document.getElementById("educationType").value = data.education_type || "";
    document.getElementById("subject").value = data.subject || "";
    document.getElementById("solutionDomain").value = data.solution_domain || "";
    document.getElementById("learningMode").value = data.learning_mode || "";
    document.getElementById("hourCredits").value = data.hour_credits || "";
    document.getElementById("syllabusLink").value = data.syllabus_link || "";
    document.getElementById("solutionSummary").value = data.solution_summary || "";
    document.getElementById("solutionGoals").value = data.solution_goals || "";

    openModal();
  });
}

function deleteLearningSolution(id) {
  if (confirm("האם אתה בטוח שברצונך למחוק את הפתרון?")) {
    learningSolutionsRef.child(id).remove().then(() => {
      loadLearningSolutions();
    });
  }
}

function generateId() {
  return "LS" + Math.floor(Math.random() * 100000);
}


// פותח את חלון הפופאפ
function openLearningSolutionPopup() {
  document.getElementById("learningSolutionPopup").style.display = "flex";
}

// סוגר את חלון הפופאפ
function closeLearningSolutionPopup() {
  document.getElementById("learningSolutionPopup").style.display = "none";
}


// מציג טופס הוספת פתרון למידה בתוך חלון הפופאפ
function showSolutionForm() {
  const popupContent = document.getElementById("popupContent");
  popupContent.innerHTML = `
    <h4>הוספת פתרון למידה חדש</h4>
    <input type="text" id="solutionNumber" placeholder="מספר פתרון למידה"><br>
    <input type="text" id="solutionName" placeholder="שם פתרון למידה"><br>
    <input type="text" id="creatorName" placeholder="שם יוצר"><br>
    <input type="text" id="lecturerName" placeholder="שם המרצה"><br>
    <input type="date" id="startDate" placeholder="תאריך התחלה"><br>
    <input type="text" id="meetingDay" placeholder="יום מפגש קבוע"><br>
    <input type="time" id="startTime" placeholder="שעת התחלה"><br>
    <input type="time" id="endTime" placeholder="שעת סיום"><br>
    <input type="text" id="educationLevels" placeholder="שלבי חינוך"><br>
    <input type="text" id="educationType" placeholder="סוג חינוך"><br>
    <input type="text" id="subject" placeholder="תחום דעת"><br>
    <input type="text" id="solutionDomain" placeholder="תחום פתרון"><br>
    <input type="text" id="learningMode" placeholder="אופן למידה"><br>
    <input type="text" id="hourCredits" placeholder="היקף שעות אקדמיות"><br>
    <input type="url" id="syllabusLink" placeholder="קישור לסילבוס"><br>
    <textarea id="solutionSummary" placeholder="תקציר"></textarea><br>
    <textarea id="solutionGoals" placeholder="מטרות"></textarea><br>
    <button onclick="saveLearningSolution()">שמירה</button>
  `;
}
