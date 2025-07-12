
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
    summary: ""
  };

  if (id) {
    d = popupData.find(item => item.id === id) || d;
    editingId = id;
  }

  document.getElementById("popupContent").innerHTML = `
    <h4>${id ? "עריכת פתרון" : "הוספת פתרון חדש"}</h4>
    <input type="text" id="formSolutionName" placeholder="שם פתרון" value="${d.solution_name || ""}" style="width:100%;margin-bottom:5px;">
    <input type="text" id="formCreator" placeholder="שם מנחה" value="${d.creator_name || ""}" style="width:100%;margin-bottom:5px;">
    <input type="date" id="formDate" value="${d.first_meeting_date || ""}" style="width:100%;margin-bottom:5px;">
    <input type="text" id="formWeekday" placeholder="יום" value="${d.weekday || ""}" style="width:100%;margin-bottom:5px;">
    <input type="text" id="formLevels" placeholder="שלבי חינוך (מופרד בפסיקים)" value="${(d.education_levels || []).join(",")}" style="width:100%;margin-bottom:5px;">
    <input type="text" id="formHours" placeholder="שעות" value="${d.hours_count || ""}" style="width:100%;margin-bottom:5px;">
    <input type="text" id="formSubject" placeholder="תחום דעת" value="${d.subject || ""}" style="width:100%;margin-bottom:5px;">
    <textarea id="formObjectives" placeholder="מטרות" style="width:100%;margin-bottom:5px;">${d.objectives || ""}</textarea>
    <textarea id="formSummary" placeholder="תקציר" style="width:100%;margin-bottom:5px;">${d.summary || ""}</textarea>
    <div>
      <button onclick="savePopupSolution()">💾 שמור</button>
      <button onclick="renderPopupCard()">ביטול</button>
    </div>
  `;
}

function savePopupSolution() {
  const name = document.getElementById("formSolutionName").value;
  const creator = document.getElementById("formCreator").value;
  const date = document.getElementById("formDate").value;
  const weekday = document.getElementById("formWeekday").value;
  const levels = document.getElementById("formLevels").value.split(",").map(s => s.trim());
  const hours = document.getElementById("formHours").value;
  const subject = document.getElementById("formSubject").value;
  const objectives = document.getElementById("formObjectives").value;
  const summary = document.getElementById("formSummary").value;

  const data = {
    solution_name: name,
    creator_name: creator,
    first_meeting_date: date,
    weekday,
    education_levels: levels,
    hours_count: hours,
    subject,
    objectives,
    summary
  };

  const id = editingId || Date.now().toString();
  db.ref("learning_solutions/" + id).set(data).then(() => {
    alert("נשמר בהצלחה!");
    openLearningSolutionPopup(); // רענון
  });
}

function filterPopupResults() {
  const term = document.getElementById("popupSearch").value.toLowerCase();
  popupData = fullData.filter(d =>
    (d.solution_name || "").toLowerCase().includes(term) ||
    (d.subject || "").toLowerCase().includes(term) ||
    (d.creator_name || "").toLowerCase().includes(term)
  );
  popupIndex = 0;
  if (popupData.length > 0) {
    renderPopupCard();
  } else {
    document.getElementById("popupContent").innerHTML = "<p>לא נמצאו תוצאות</p>";
    document.getElementById("popupCounter").textContent = "0 / 0";
  }
}

function printAllLearningSolutions() {
  let html = "<html><head><title>רשימת פתרונות למידה</title></head><body dir='rtl'><h2>רשימת פתרונות למידה</h2><table border='1' cellpadding='5'><thead><tr><th>שם</th><th>מנחה</th><th>תאריך</th><th>שעות</th><th>תחום</th></tr></thead><tbody>";
  fullData.forEach(d => {
    html += `<tr><td>${d.solution_name || ""}</td><td>${d.creator_name || ""}</td><td>${d.first_meeting_date || ""}</td><td>${d.hours_count || ""}</td><td>${d.subject || ""}</td></tr>`;
  });
  html += "</tbody></table></body></html>";
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}

window.openLearningSolutionPopup = openLearningSolutionPopup;
window.closeLearningSolutionPopup = closeLearningSolutionPopup;
