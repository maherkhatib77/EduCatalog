
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
    <p><strong>שלבים:</strong> ${(d.education_levels || []).join(", ")}</p>
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
    hours_count: "",
    subject: "",
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
    <input type="text" id="formCreator" value="${d.creator_name || ""}" style="width:100%;margin-bottom:5px;">

    <label>תאריך התחלה:</label>
    <input type="date" id="formDate" value="${d.first_meeting_date || ""}" style="width:100%;margin-bottom:5px;">

    <label>תחום דעת:</label>
    <input type="text" id="formSubject" value="${d.subject || ""}" style="width:100%;margin-bottom:5px;">

    <label>יום קבוע:</label>
    <input type="text" id="formWeekday" value="${d.weekday || ""}" style="width:100%;margin-bottom:5px;">

    <label>שלבי חינוך:</label>
    <input type="text" id="formLevels" placeholder="יסודי, חטיבה, תיכון" value="${(d.education_levels || []).join(',')}" style="width:100%;margin-bottom:5px;">

    <label>היקף שעות:</label>
    <input type="text" id="formHours" value="${d.hours_count || ""}" style="width:100%;margin-bottom:5px;">

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
}

window.openLearningSolutionPopup = openLearningSolutionPopup;
window.closeLearningSolutionPopup = closeLearningSolutionPopup;
