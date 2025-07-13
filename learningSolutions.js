let popupData = [];
let popupIndex = 0;
let fullData = [];
let editingId = null;

function openLearningSolutionPopup() {
  db.ref("learning_solutions").once("value", snapshot => {
    popupData = [];
    fullData = [];
    snapshot.forEach(child => {
      const d = child.val();
      d.id = child.key;
      fullData.push(d);
    });
    popupData = [...fullData];
    if (popupData.length > 0) {
      popupIndex = 0;
      renderPopupCard();
      document.getElementById("learningSolutionPopup").style.display = "flex";
    } else {
      alert("אין פתרונות להצגה.");
    }
  });
}

function closeLearningSolutionPopup() {
  document.getElementById("learningSolutionPopup").style.display = "none";
}

function renderPopupCard() {
  const d = popupData[popupIndex];
  const content = document.getElementById("popupContent");
  const counter = document.getElementById("popupCounter");
  editingId = null;

  content.innerHTML = `
    <p><strong>שם:</strong> ${d.solution_name || ""}</p>
    <p><strong>מנחה:</strong> ${d.creator_name || ""}</p>
    <p><strong>תאריך:</strong> ${d.first_meeting_date || ""}</p>
    <p><strong>יום:</strong> ${d.weekday || ""}</p>
    <p><strong>שלבים:</strong> ${Object.values(d.education_levels || {}).join(", ")}</p>
    <p><strong>שעות:</strong> ${d.hours_count || ""}</p>
    <p><strong>תחום דעת:</strong> ${d.subject || ""}</p>
    <p><strong>מטרות:</strong> ${d.objectives || ""}</p>
    <p><strong>תקציר:</strong> ${d.summary || ""}</p>
    <p><strong>סילבוס:</strong> ${d.syllabus_link || ""}</p>
    <div style="margin-top: 10px;">
      <button onclick="showSolutionForm('${d.id}')">✎ ערוך</button>
      <button onclick="deleteLearningSolution('${d.id}')">🗑 מחק</button>
    </div>
  `;
  counter.textContent = `${popupIndex + 1} / ${popupData.length}`;
}

function showSolutionForm(id = null) {
  let d = {
    solution_name: "",
    creator_name: "",
    first_meeting_date: "",
    weekday: "",
    education_levels: [],
    education_types: [],
    hours_count: "",
    subject: "",
    solution_domain: "",
    learning_mode: "",
    objectives: "",
    summary: "",
    syllabus_link: ""
  };

  if (id) {
    d = popupData.find(item => item.id === id) || d;
    editingId = id;
  }

  document.getElementById("popupContent").innerHTML = `
    <h4>${id ? "עריכת פתרון למידה" : "הוספת פתרון למידה חדש"}</h4>

    <label>שם פתרון הלמידה:</label>
    <input type="text" id="formSolutionName" value="${d.solution_name || ""}" style="width:100%;margin-bottom:5px;">

    <label>שם המנחה:</label>
    <select id="formCreator" style="width:100%;margin-bottom:5px;"></select>

    <label>תאריך התחלה:</label>
    <input type="date" id="formDate" value="${d.first_meeting_date || ""}" style="width:100%;margin-bottom:5px;">

    <label>תחום דעת:</label>
    <select id="formSubject" style="width:100%;margin-bottom:5px;"></select>

    <label>יום קבוע:</label>
    <select id="formWeekday" style="width:100%;margin-bottom:5px;"></select>

    <label>שלבי חינוך:</label>
    <select id="formLevels" multiple style="width:100%;margin-bottom:5px;"></select>

    <label>סוג חינוך:</label>
    <select id="formTypes" multiple style="width:100%;margin-bottom:5px;"></select>

    <label>היקף שעות:</label>
    <select id="formHours" style="width:100%;margin-bottom:5px;"></select>

    <label>תחום פתרון למידה:</label>
    <select id="formDomain" style="width:100%;margin-bottom:5px;"></select>

    <label>אופן למידה:</label>
    <select id="formMode" style="width:100%;margin-bottom:5px;"></select>

    <label>קישור לסילבוס:</label>
    <input type="url" id="formSyllabus" value="${d.syllabus_link || ""}" style="width:100%;margin-bottom:5px;">

    <label>מטרות פתרון הלמידה:</label>
    <textarea id="formObjectives" style="width:100%;margin-bottom:5px;">${d.objectives || ""}</textarea>

    <label>תקציר פתרון הלמידה:</label>
    <textarea id="formSummary" style="width:100%;margin-bottom:5px;">${d.summary || ""}</textarea>

    <div>
      <button onclick="savePopupSolution()">💾 שמור</button>
      <button onclick="renderPopupCard()">ביטול</button>
    </div>
  `;

  populateSelect("formCreator", "instructors", "first_name", "last_name");
  populateSelect("formWeekday", "weekdays", "name");
  populateSelect("formLevels", "education_levels", "title", null, true);
  populateSelect("formTypes", "education_types", "title", null, true);
  populateSelect("formHours", "hour_credits", "hours");
  populateSelect("formSubject", "subjects", "name");
  populateSelect("formDomain", "solution_domains", "name");
  populateSelect("formMode", "learning_modes", "title");
}

function savePopupSolution() {
  const data = {
    solution_name: document.getElementById("formSolutionName").value.trim(),
    creator_name: document.getElementById("formCreator").value.trim(),
    first_meeting_date: document.getElementById("formDate").value,
    subject: document.getElementById("formSubject").value.trim(),
    weekday: document.getElementById("formWeekday").value.trim(),
    education_levels: Array.from(document.getElementById("formLevels").selectedOptions).map(opt => opt.value),
    education_types: Array.from(document.getElementById("formTypes").selectedOptions).map(opt => opt.value),
    hours_count: document.getElementById("formHours").value.trim(),
    solution_domain: document.getElementById("formDomain").value.trim(),
    learning_mode: document.getElementById("formMode").value.trim(),
    syllabus_link: document.getElementById("formSyllabus").value.trim(),
    objectives: document.getElementById("formObjectives").value.trim(),
    summary: document.getElementById("formSummary").value.trim()
  };

  const ref = editingId ? db.ref("learning_solutions/" + editingId) : db.ref("learning_solutions").push();
  ref.set(data, (error) => {
    if (error) {
      alert("שגיאה בשמירה");
    } else {
      alert("נשמר בהצלחה");
      openLearningSolutionPopup();
    }
  });
}

function populateSelect(id, path, field, secondField = null, multi = false) {
  const select = document.getElementById(id);
  select.innerHTML = multi ? "" : "<option value=''>בחר</option>";
  db.ref(path).once("value", snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const label = secondField ? `${data[field] || ""} ${data[secondField] || ""}`.trim() : data[field];
      const option = document.createElement("option");
      option.value = label;
      option.textContent = label;
      select.appendChild(option);
    });
  });
}

window.openLearningSolutionPopup = openLearningSolutionPopup;
window.closeLearningSolutionPopup = closeLearningSolutionPopup;