
let popupData = [];
let popupIndex = 0;
let fullData = [];

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
      <button onclick="editLearningSolution('${d.id}')">✎ ערוך</button>
      <button onclick="deleteLearningSolution('${d.id}')">🗑 מחק</button>
    </div>
  `;
  counter.textContent = `${popupIndex + 1} / ${popupData.length}`;
}

function prevPopupCard() {
  if (popupIndex > 0) {
    popupIndex--;
    renderPopupCard();
  }
}

function nextPopupCard() {
  if (popupIndex < popupData.length - 1) {
    popupIndex++;
    renderPopupCard();
  }
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
