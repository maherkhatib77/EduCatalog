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
    <p><strong>מספר פתרון הלמידה:</strong> ${d.id || ""}</p>
    <p><strong>שם פתרון הלמידה:</strong> ${d.solution_name || ""}</p>
    <p><strong>שם יוצר פתרון הלמידה:</strong> ${d.creator_name || ""}</p>
    <p><strong>שם מרצה פתרון הלמידה:</strong> ${d.lecturer_name || ""}</p>
    <p><strong>תאריך מפגש ראשון:</strong> ${d.first_meeting_date || ""}</p>
    <p><strong>יום המפגש הקבוע:</strong> ${d.weekday || ""}</p>
    <p><strong>זמני המפגש – התחלה:</strong> ${d.start_time || ""}</p>
    <p><strong>זמני המפגש – סיום:</strong> ${d.end_time || ""}</p>
    <p><strong>שלבי חינוך:</strong> ${Object.values(d.education_levels || {}).join(", ")}</p>
    <p><strong>סוג חינוך:</strong> ${Object.values(d.education_types || {}).join(", ")}</p>
    <p><strong>אופן למידה:</strong> ${d.learning_mode || ""}</p>
    <p><strong>היקף שעות אקדמיות מוכר לגמול:</strong> ${d.hours_count || ""}</p>

    <div style="margin-top: 10px;">
      <button onclick="showSolutionForm('${d.id}')">✎ ערוך</button>
      <button onclick="deleteLearningSolution('${d.id}')">🗑 מחק</button>
    </div>
  `;
  counter.textContent = `${popupIndex + 1} / ${popupData.length}`;
}

function showSolutionForm(id = null) {
  let d = {
    id: "",
    solution_name: "",
    creator_name: "",
    lecturer_name: "",
    first_meeting_date: "",
    start_time: "",
    end_time: "",
    weekday: "",
    education_levels: [],
    education_types: [],
    subject: "",
    solution_domain: "",
    learning_mode: "",
    hours_count: "",
    syllabus_link: "",
    summary: "",
    objectives: ""
  };

  if (id) {
    d = popupData.find(item => item.id === id) || d;
    editingId = id;
  }

  document.getElementById("popupContent").innerHTML = `
    <h4>${id ? "עריכת פתרון למידה" : "הוספת פתרון למידה חדש"}</h4>

    <label>מספר פתרון הלמידה:</label>
    <input type="text" id="formId" value="${d.id || ""}" style="width:100%;margin-bottom:5px;" ${id ? "disabled" : ""}>

    <label>שם פתרון הלמידה:</label>
    <input type="text" id="formSolutionName" value="${d.solution_name || ""}" style="width:100%;margin-bottom:5px;">

    <label>שם מדריך:</label>
    <select id="formCreator" style="width:100%;margin-bottom:5px;"></select>

    <label>שם מרצה פתרון הלמידה:</label>
    <select id="formLecturer" style="width:100%;margin-bottom:5px;"></select>

    <label>תאריך מפגש ראשון:</label>
    <input type="date" id="formDate" value="${d.first_meeting_date || ""}" style="width:100%;margin-bottom:5px;">

    <label>יום המפגש הקבוע:</label>
    <select id="formWeekday" style="width:100%;margin-bottom:5px;"></select>

    <label>זמני המפגש – התחלה:</label>
    <input type="time" id="formStartTime" value="${d.start_time || ""}" style="width:100%;margin-bottom:5px;">

    <label>זמני המפגש – סיום:</label>
    <input type="time" id="formEndTime" value="${d.end_time || ""}" style="width:100%;margin-bottom:5px;">

    <label>שלבי חינוך:</label>
    <select id="formLevels" multiple style="width:100%;margin-bottom:5px;"></select>

    <label>סוג חינוך:</label>
    <select id="formTypes" multiple style="width:100%;margin-bottom:5px;"></select>

    <label>תחום דעת:</label>
    <select id="formSubject" style="width:100%;margin-bottom:5px;"></select>

    <label>תחום פתרון למידה:</label>
    <select id="formDomain" style="width:100%;margin-bottom:5px;"></select>

    <label>אופן למידה:</label>
    <select id="formMode" style="width:100%;margin-bottom:5px;"></select>

    <label>היקף שעות אקדמיות מוכר לגמול:</label>
    <select id="formHours" style="width:100%;margin-bottom:5px;"></select>

    <label>קישור סילבוס:</label>
    <input type="url" id="formSyllabus" value="${d.syllabus_link || ""}" style="width:100%;margin-bottom:5px;">

    <label>תקציר פתרון הלמידה:</label>
    <textarea id="formSummary" style="width:100%;margin-bottom:5px;">${d.summary || ""}</textarea>

    <label>מטרות פתרון הלמידה:</label>
    <textarea id="formObjectives" style="width:100%;margin-bottom:5px;">${d.objectives || ""}</textarea>

    <div>
      <button onclick="savePopupSolution()">💾 שמור</button>
      <button onclick="renderPopupCard()">ביטול</button>
    </div>
  `;

  populateSelect("formCreator", "instructors", "first_name", "last_name");
  populateSelect("formLecturer", "lecturers", "first_name", "last_name").then(() => {
    if (d.lecturer_name) {
      const formLecturer = document.getElementById("formLecturer");
      Array.from(formLecturer.options).forEach(opt => {
        if (opt.value === d.lecturer_name) {
          opt.selected = true;
        }
      });
    }
  });
  populateSelect("formWeekday", "weekdays", "Title");
  populateSelect("formLevels", "education_levels", "Title", null, true);
  populateSelect("formTypes", "education_types", "Title", null, true);
  populateSelect("formSubject", "subjects", "Title");
  populateSelect("formDomain", "solution_domains", "Title");
  populateSelect("formMode", "learning_modes", "title");
  populateSelect("formHours", "hour_credits", "Title");
}

function savePopupSolution() {
  const isEdit = Boolean(editingId);
  const ref = isEdit
    ? db.ref("learning_solutions/" + editingId)
    : db.ref("learning_solutions").push();

  const data = {
    solution_name: document.getElementById("formSolutionName").value.trim(),
    creator_name: document.getElementById("formCreator").value.trim(),
    lecturer_name: document.getElementById("formLecturer").value.trim(),
    first_meeting_date: document.getElementById("formDate").value,
    weekday: document.getElementById("formWeekday").value.trim(),
    start_time: document.getElementById("formStartTime").value,
    end_time: document.getElementById("formEndTime").value,
    education_levels: Array.from(document.getElementById("formLevels").selectedOptions).map(opt => opt.value),
    education_types: Array.from(document.getElementById("formTypes").selectedOptions).map(opt => opt.value),
    subject: document.getElementById("formSubject").value.trim(),
    solution_domain: document.getElementById("formDomain").value.trim(),
    learning_mode: document.getElementById("formMode").value.trim(),
    hours_count: document.getElementById("formHours").value.trim(),
    syllabus_link: document.getElementById("formSyllabus").value.trim(),
    summary: document.getElementById("formSummary").value.trim(),
    objectives: document.getElementById("formObjectives").value.trim()
  };

  if (!isEdit) {
    const formId = document.getElementById("formId").value.trim();
    if (formId) {
      data.id = formId;
    }
  }

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

  return db.ref(path).once("value").then(snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const label = secondField
        ? `${data[field] || ""} ${data[secondField] || ""}`.trim()
        : data[field];
      const option = document.createElement("option");
      option.value = label;
      option.textContent = label;
      select.appendChild(option);
    });
  });
}

window.openLearningSolutionPopup = openLearningSolutionPopup;
window.closeLearningSolutionPopup = closeLearningSolutionPopup;
